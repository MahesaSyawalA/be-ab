import { prisma } from "../../config/prisma.ts";
import { formatDocNumber, type DocPrefix } from "../../common/utils/doc-number.ts";
import { nilaiRealisasi } from "../../common/utils/nilai-revenue.ts";
import type { JenisTahap } from "../tahap-kanban/tahap-kanban.types.ts";

/** Nomor berikutnya di bulan berjalan; lompat bila sudah terpakai (kolom no_* unik). */
async function nextDocNumber(prefix: DocPrefix, now: Date): Promise<string> {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  let seq =
    1 +
    (prefix === "QUO"
      ? await prisma.penawaran.count({ where: { tanggal_penawaran: { gte: monthStart } } })
      : await prisma.purchaseOrder.count({ where: { tanggal_po: { gte: monthStart } } }));
  for (;;) {
    const no = formatDocNumber(prefix, now, seq);
    const taken =
      prefix === "QUO"
        ? await prisma.penawaran.findUnique({ where: { no_penawaran: no } })
        : await prisma.purchaseOrder.findUnique({ where: { no_po: no } });
    if (!taken) return no;
    seq += 1;
  }
}

/**
 * Efek samping saat tiket MASUK ke kolom, dibaca dari `jenis_tahap` (bukan nama/id kolom),
 * jadi berlaku untuk kolom dinamis mana pun, termasuk beberapa kolom dengan jenis sama.
 * - quotation: catat tanggal penawaran awal (sekali) + buat `Penawaran` revisi baru.
 * - po: buat `PurchaseOrder`, tandai penawaran terakhir disetujui.
 * - revenue: isi realisasi revenue di PO terakhir + tanggal closing (sekali).
 * shortcut: url file kosong sampai evidence diunggah, nomor dokumen urut per bulan tanpa transaksi DB
 * (dua simpan bersamaan bisa bentrok di kolom unik); upgrade bila penulisan harus atomik.
 */
function resolveDate(val?: string | Date | null): Date {
  if (!val) return new Date();
  const parsed = new Date(val);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export async function createPenawaranRevision(
  idTiket: string,
  nilai: number,
  options?: { idAktivitas?: string; docDate?: string | Date | null },
) {
  const now = new Date();
  const effectiveDate = resolveDate(options?.docDate);
  await prisma.tiket.updateMany({
    where: { id_tiket: idTiket, tanggal_penawaran_awal: null },
    data: { tanggal_penawaran_awal: effectiveDate },
  });
  const revisi = await prisma.penawaran.count({ where: { id_tiket: idTiket } });
  return prisma.penawaran.create({
    data: {
      id_tiket: idTiket,
      ...(options?.idAktivitas ? { id_aktivitas: options.idAktivitas } : {}),
      no_penawaran: await nextDocNumber("QUO", now),
      revisi_ke: revisi,
      tanggal_penawaran: effectiveDate,
      total_nilai: nilai,
      status: "dikirim",
      url_file_penawaran: "",
    },
  });
}

export async function applyStageEffects(
  idTiket: string,
  jenis: JenisTahap,
  nilai: number,
  statusTiket: "open" | "won" | "lost",
  docDate?: string | Date | null,
  nilaiDokumen?: number,
): Promise<void> {
  const now = new Date();
  const effectiveDate = resolveDate(docDate);

  if (jenis === "quotation") {
    await createPenawaranRevision(idTiket, nilai, { docDate });
    return;
  }

  const penawaran = await prisma.penawaran.findFirst({
    where: { id_tiket: idTiket },
    orderBy: { created_at: "desc" },
  });

  if (jenis === "po") {
    await prisma.purchaseOrder.create({
      data: {
        id_tiket: idTiket,
        id_penawaran: penawaran?.id_penawaran ?? null,
        no_po: await nextDocNumber("PO", now),
        tanggal_po: now,
        nilai_po: nilai,
        status: "diterima",
        url_file_po: "",
        nilai_revenue: 0,
      },
    });
    if (penawaran) {
      await prisma.penawaran.update({
        where: { id_penawaran: penawaran.id_penawaran },
        data: { status: "disetujui" },
      });
    }
    return;
  }

  if (jenis === "revenue") {
    await prisma.tiket.updateMany({
      where: { id_tiket: idTiket, tanggal_closing: null },
      data: { tanggal_closing: now },
    });
    const po = await prisma.purchaseOrder.findFirst({
      where: { id_tiket: idTiket },
      orderBy: { created_at: "desc" },
    });
    const status = statusTiket === "lost" ? "dibatalkan" : "selesai";
    const realisasi = nilaiRealisasi(statusTiket, nilaiDokumen, po?.nilai_po, nilai);
    if (po) {
      await prisma.purchaseOrder.update({
        where: { id_po: po.id_po },
        data: { nilai_revenue: realisasi, tanggal_revenue: now, status },
      });
    } else {
      await prisma.purchaseOrder.create({
        data: {
          id_tiket: idTiket,
          id_penawaran: penawaran?.id_penawaran ?? null,
          no_po: await nextDocNumber("PO", now),
          tanggal_po: now,
          nilai_po: nilai,
          status,
          url_file_po: "",
          nilai_revenue: realisasi,
          tanggal_revenue: now,
        },
      });
    }
  }
}

/**
 * Saat aktivitas `quotation` dibuat:
 * - Jika baru saja ada `Penawaran` tanpa `id_aktivitas` (dari pindah tahap / buat tiket di tahap quotation),
 *   tautkan langsung ke aktivitas ini agar tidak dobel.
 * - Jika tidak ada (mis. tambah aktivitas revisi di tahap quotation yang sama), buat record `Penawaran` revisi baru.
 */
export async function ensurePenawaranForAktivitas(
  idAktivitas: string,
  idTiket: string,
  totalNilai?: number,
  docDate?: string | Date | null,
): Promise<void> {
  const recentThreshold = new Date(Date.now() - 30_000);
  const unlinkedRecent = await prisma.penawaran.findFirst({
    where: {
      id_tiket: idTiket,
      id_aktivitas: null,
      created_at: { gte: recentThreshold },
    },
    orderBy: { created_at: "desc" },
  });

  if (unlinkedRecent) {
    await prisma.penawaran.update({
      where: { id_penawaran: unlinkedRecent.id_penawaran },
      data: {
        id_aktivitas: idAktivitas,
        ...(totalNilai !== undefined ? { total_nilai: totalNilai } : {}),
        ...(docDate ? { tanggal_penawaran: resolveDate(docDate) } : {}),
      },
    });
    return;
  }

  let nilai = totalNilai;
  if (nilai === undefined) {
    const tiket = await prisma.tiket.findUnique({
      where: { id_tiket: idTiket },
      select: { estimasi_nilai: true },
    });
    nilai = Number(tiket?.estimasi_nilai ?? 0);
  }

  await createPenawaranRevision(idTiket, nilai, { idAktivitas, docDate });
}

/** Setelah evidence diunggah di aktivitas quotation/po, tautkan file ke dokumen terbaru tiket itu. */
export async function linkEvidenceToDocument(idAktivitas: string, url: string): Promise<void> {
  const akt = await prisma.aktivitas.findUnique({
    where: { id_aktivitas: idAktivitas },
    select: { id_tiket: true, jenis_kegiatan: true },
  });
  if (!akt) return;

  if (akt.jenis_kegiatan === "quotation") {
    const p =
      (await prisma.penawaran.findFirst({
        where: { id_aktivitas: idAktivitas },
        orderBy: { created_at: "desc" },
      })) ??
      (await prisma.penawaran.findFirst({
        where: { id_tiket: akt.id_tiket },
        orderBy: { created_at: "desc" },
      }));
    if (p) await prisma.penawaran.update({ where: { id_penawaran: p.id_penawaran }, data: { url_file_penawaran: url, id_aktivitas: idAktivitas } });
  } else if (akt.jenis_kegiatan === "po") {
    const po = await prisma.purchaseOrder.findFirst({ where: { id_tiket: akt.id_tiket }, orderBy: { created_at: "desc" } });
    if (po) await prisma.purchaseOrder.update({ where: { id_po: po.id_po }, data: { url_file_po: url } });
  }
}
