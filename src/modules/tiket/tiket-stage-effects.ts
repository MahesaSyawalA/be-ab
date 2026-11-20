import { prisma } from "../../config/prisma.ts";
import type { JenisTahap } from "../tahap-kanban/tahap-kanban.types.ts";

const kode = (idTiket: string) => idTiket.slice(0, 8).toUpperCase();

/**
 * Efek samping saat tiket MASUK ke kolom, dibaca dari `jenis_tahap` (bukan nama/id kolom),
 * jadi berlaku untuk kolom dinamis mana pun, termasuk beberapa kolom dengan jenis sama.
 * - quotation: catat tanggal penawaran awal (sekali) + buat `Penawaran` revisi baru.
 * - po: buat `PurchaseOrder`, tandai penawaran terakhir disetujui.
 * - revenue: isi realisasi revenue di PO terakhir + tanggal closing (sekali).
 * shortcut: nomor dokumen otomatis & url file kosong sampai evidence diunggah, tanpa transaksi DB;
 * upgrade bila nomor resmi perlu diinput sales atau penulisan harus atomik.
 */
export async function applyStageEffects(
  idTiket: string,
  jenis: JenisTahap,
  nilai: number,
  statusTiket: "open" | "won" | "lost",
): Promise<void> {
  const now = new Date();

  if (jenis === "quotation") {
    await prisma.tiket.updateMany({
      where: { id_tiket: idTiket, tanggal_penawaran_awal: null },
      data: { tanggal_penawaran_awal: now },
    });
    const revisi = await prisma.penawaran.count({ where: { id_tiket: idTiket } });
    await prisma.penawaran.create({
      data: {
        id_tiket: idTiket,
        no_penawaran: `PNW-${kode(idTiket)}-R${revisi}`,
        revisi_ke: revisi,
        tanggal_penawaran: now,
        total_nilai: nilai,
        status: "dikirim",
        url_file_penawaran: "",
      },
    });
    return;
  }

  const penawaran = await prisma.penawaran.findFirst({
    where: { id_tiket: idTiket },
    orderBy: { created_at: "desc" },
  });

  if (jenis === "po") {
    const urut = await prisma.purchaseOrder.count({ where: { id_tiket: idTiket } });
    await prisma.purchaseOrder.create({
      data: {
        id_tiket: idTiket,
        id_penawaran: penawaran?.id_penawaran ?? null,
        no_po: `PO-${kode(idTiket)}-${urut + 1}`,
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
    const realisasi = statusTiket === "lost" ? 0 : nilai;
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
          no_po: `PO-${kode(idTiket)}-1`,
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

/** Setelah evidence diunggah di aktivitas quotation/po, tautkan file ke dokumen terbaru tiket itu. */
export async function linkEvidenceToDocument(idAktivitas: string, url: string): Promise<void> {
  const akt = await prisma.aktivitas.findUnique({
    where: { id_aktivitas: idAktivitas },
    select: { id_tiket: true, jenis_kegiatan: true },
  });
  if (!akt) return;

  if (akt.jenis_kegiatan === "quotation") {
    const p = await prisma.penawaran.findFirst({ where: { id_tiket: akt.id_tiket }, orderBy: { created_at: "desc" } });
    if (p) await prisma.penawaran.update({ where: { id_penawaran: p.id_penawaran }, data: { url_file_penawaran: url, id_aktivitas: idAktivitas } });
  } else if (akt.jenis_kegiatan === "po") {
    const po = await prisma.purchaseOrder.findFirst({ where: { id_tiket: akt.id_tiket }, orderBy: { created_at: "desc" } });
    if (po) await prisma.purchaseOrder.update({ where: { id_po: po.id_po }, data: { url_file_po: url } });
  }
}
