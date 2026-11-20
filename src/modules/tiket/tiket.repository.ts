import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { cycleDays } from "../../common/utils/sales-cycle.ts";
import { applyStageEffects } from "./tiket-stage-effects.ts";
import type { JenisTahap } from "../tahap-kanban/tahap-kanban.types.ts";
import type {
  Tiket,
  TiketFilters,
  TiketSortBy,
  TiketWithDetails,
  CreateTiketInput,
  UpdateTiketInput,
} from "./tiket.types.ts";

function toDate(val?: string | Date | null): Date | null | undefined {
  if (val === undefined) return undefined;
  if (val === null) return null;
  return new Date(val);
}

// Nilai tahap quotation/po/revenue disimpan di Penawaran/PurchaseOrder, bukan menimpa estimasi_nilai tiket.
const DOCUMENT_STAGES: JenisTahap[] = ["quotation", "po", "revenue"];

async function jenisTahapOf(idTahap: string): Promise<JenisTahap | undefined> {
  const tahap = await prisma.tahapKanban.findUnique({ where: { id_tahap: idTahap }, select: { jenis_tahap: true } });
  return tahap?.jenis_tahap;
}

const ticketInclude = {
  pelanggan: true,
  kontak: true,
  user: true,
  tahap: true,
  penawaran: {
    orderBy: { created_at: "desc" as const },
    take: 1,
  },
  aktivitas: {
    include: {
      user: true,
      bukti_kunjungan: true,
      evidence: true,
    },
    orderBy: { created_at: "desc" as const },
  },
  riwayat_tahap: {
    include: {
      tahap_asal: true,
      tahap_tujuan: true,
      user: true,
    },
    orderBy: { waktu_pindah: "desc" as const },
  },
};

function buildOrderBy(
  sortBy: TiketSortBy,
  order: PaginationParams["order"],
): Prisma.TiketOrderByWithRelationInput[] {
  const primary: Prisma.TiketOrderByWithRelationInput =
    sortBy === "posisi"
      ? { posisi: order }
      : sortBy === "estimasi_closing"
        ? { estimasi_closing: order }
        : sortBy === "estimasi_nilai"
          ? { estimasi_nilai: order }
          : { created_at: order };

  return [primary, { id_tiket: "asc" }];
}

function getInitials(name?: string | null): string {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDates(date: Date | string | null | undefined) {
  if (!date) return { short: undefined, full: undefined };
  const d = new Date(date);
  if (isNaN(d.getTime())) return { short: undefined, full: undefined };
  const day = d.getDate();
  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const mShort = monthsShort[d.getMonth()] ?? "";
  const year = d.getFullYear();
  return {
    short: `${day} ${mShort}`,
    full: `${String(day).padStart(2, "0")} ${mShort} ${year}`,
  };
}

export function mapToTiketWithDetails(raw: any): TiketWithDetails {
  const dates = formatDates(raw.estimasi_closing);
  const latestPenawaran = raw.penawaran?.[0];
  const kode_tiket = raw.id_tiket?.startsWith("tkt-")
    ? raw.id_tiket.toUpperCase()
    : `TKT-${String(raw.id_tiket || "")
        .slice(0, 6)
        .toUpperCase()}`;

  return {
    id_tiket: raw.id_tiket,
    id_pelanggan: raw.id_pelanggan,
    id_user: raw.id_user,
    id_tahap: raw.id_tahap,
    id_kontak: raw.id_kontak,
    judul: raw.judul,
    estimasi_nilai: raw.estimasi_nilai,
    estimasi_closing: raw.estimasi_closing,
    status: raw.status,
    kebutuhan_pelanggan: raw.kebutuhan_pelanggan,
    prioritas: raw.prioritas,
    posisi: raw.posisi,
    tanggal_penawaran_awal: raw.tanggal_penawaran_awal,
    tanggal_closing: raw.tanggal_closing,
    alasan_lost: raw.alasan_lost,
    durasi_siklus_hari: cycleDays(
      (raw.riwayat_tahap ?? []).map((rw: any) => ({
        jenis_tahap: rw.tahap_tujuan?.jenis_tahap,
        waktu_pindah: rw.waktu_pindah,
      })),
      raw.tanggal_penawaran_awal,
      raw.tanggal_closing,
    ),
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    kode_tiket,
    nama_outlet: raw.pelanggan?.nama_outlet ?? raw.pelanggan?.nama_faskes ?? "",
    nama_pic: raw.kontak?.nama,
    jabatan_pic: raw.kontak?.jabatan,
    no_telp_pic: raw.kontak?.no_telp,
    nama_sales: raw.user?.nama,
    inisial_sales: getInitials(raw.user?.nama),
    closing_short_label: dates.short,
    closing_full_label: dates.full,
    file_penawaran: latestPenawaran
      ? {
          name: latestPenawaran.no_penawaran || "penawaran.pdf",
          size: "Dokumen PDF",
        }
      : null,
    aktivitas_list: raw.aktivitas?.map((act: any) => ({
      id_aktivitas: act.id_aktivitas,
      id_user: act.id_user,
      id_tiket: act.id_tiket,
      tanggal: act.tanggal,
      catatan: act.catatan,
      jenis_kegiatan: act.jenis_kegiatan,
      jadwal_follow_up: act.jadwal_follow_up,
      created_at: act.created_at,
      updated_at: act.updated_at,
      nama_petugas: act.user?.nama ?? "Petugas",
      pic_ditemui: raw.kontak?.nama ?? "-",
      waktu_label: new Date(act.tanggal).toLocaleDateString("id-ID"),
      evidence: act.bukti_kunjungan?.[0]
        ? {
            id: act.bukti_kunjungan[0].id_bukti,
            tipe: "foto" as const,
            url_preview: act.bukti_kunjungan[0].img_url,
            deskripsi: `Bukti Kunjungan (${act.bukti_kunjungan[0].dalam_radius ? "Dalam Radius" : "Luar Radius"})`,
          }
        : null,
    })),
    riwayat_list: raw.riwayat_tahap?.map((rw: any) => ({
      id_riwayat: rw.id_riwayat,
      id_tiket: rw.id_tiket,
      id_tahap_asal: rw.id_tahap_asal,
      id_tahap_tujuan: rw.id_tahap_tujuan,
      id_user: rw.id_user,
      waktu_pindah: rw.waktu_pindah,
      nama_tahap_asal: rw.tahap_asal?.nama_tahap ?? null,
      nama_tahap_tujuan: rw.tahap_tujuan?.nama_tahap ?? "",
      nama_user: rw.user?.nama ?? "User",
      waktu_label: new Date(rw.waktu_pindah).toLocaleDateString("id-ID"),
    })),
  };
}

export const tiketRepository = {
  async create(data: CreateTiketInput): Promise<TiketWithDetails> {
    const created = await prisma.tiket.create({
      data: {
        id_pelanggan: data.id_pelanggan,
        id_user: data.id_user,
        id_tahap: data.id_tahap,
        id_kontak: data.id_kontak ?? null,
        judul: data.judul,
        estimasi_nilai: data.estimasi_nilai,
        estimasi_closing: new Date(data.estimasi_closing),
        status: data.status,
        kebutuhan_pelanggan: data.kebutuhan_pelanggan,
        prioritas: data.prioritas,
        posisi: data.posisi,
        tanggal_penawaran_awal: toDate(data.tanggal_penawaran_awal),
        tanggal_closing: toDate(data.tanggal_closing),
        alasan_lost: data.alasan_lost ?? null,
      },
      include: ticketInclude,
    });

    // Catat riwayat tahap inisial secara otomatis
    await prisma.riwayatTahap
      .create({
        data: {
          id_tiket: created.id_tiket,
          id_tahap_asal: null,
          id_tahap_tujuan: created.id_tahap,
          id_user: created.id_user,
        },
      })
      .catch(() => null);

    const jenis = await jenisTahapOf(created.id_tahap);
    if (jenis) {
      await applyStageEffects(created.id_tiket, jenis, created.estimasi_nilai, created.status);
      return (await this.getById(created.id_tiket)) ?? mapToTiketWithDetails(created);
    }
    return mapToTiketWithDetails(created);
  },

  async getAll(
    filters: TiketFilters,
    pagination: PaginationParams,
    sortBy: TiketSortBy,
  ): Promise<{ items: TiketWithDetails[]; total: number }> {
    const where: Prisma.TiketWhereInput = {
      id_pelanggan: filters.id_pelanggan,
      id_user: filters.id_user,
      id_tahap: filters.id_tahap,
      id_kontak: filters.id_kontak,
      status: filters.status,
      prioritas: filters.prioritas,
      ...(filters.search && {
        OR: [
          { judul: { contains: filters.search } },
          { pelanggan: { nama_outlet: { contains: filters.search } } },
        ],
      }),
    };

    const [rows, total] = await prisma.$transaction([
      prisma.tiket.findMany({
        where,
        include: ticketInclude,
        orderBy: buildOrderBy(sortBy, pagination.order),
        ...toSkipTake(pagination),
      }),
      prisma.tiket.count({ where }),
    ]);

    return { items: rows.map(mapToTiketWithDetails), total };
  },

  async getById(id: string): Promise<TiketWithDetails | null> {
    const row = await prisma.tiket.findUnique({
      where: { id_tiket: id },
      include: ticketInclude,
    });
    return row ? mapToTiketWithDetails(row) : null;
  },

  async getByPelangganId(idPelanggan: string): Promise<TiketWithDetails[]> {
    const rows = await prisma.tiket.findMany({
      where: { id_pelanggan: idPelanggan },
      include: ticketInclude,
      orderBy: { created_at: "desc" },
    });
    return rows.map(mapToTiketWithDetails);
  },

  async getByUserId(idUser: string): Promise<TiketWithDetails[]> {
    const rows = await prisma.tiket.findMany({
      where: { id_user: idUser },
      include: ticketInclude,
      orderBy: { created_at: "desc" },
    });
    return rows.map(mapToTiketWithDetails);
  },

  async getByTahapId(idTahap: string): Promise<TiketWithDetails[]> {
    const rows = await prisma.tiket.findMany({
      where: { id_tahap: idTahap },
      include: ticketInclude,
      orderBy: { posisi: "asc" },
    });
    return rows.map(mapToTiketWithDetails);
  },

  async getByKontakId(idKontak: string): Promise<TiketWithDetails[]> {
    const rows = await prisma.tiket.findMany({
      where: { id_kontak: idKontak },
      include: ticketInclude,
      orderBy: { created_at: "desc" },
    });
    return rows.map(mapToTiketWithDetails);
  },

  async update(
    id: string,
    data: UpdateTiketInput,
  ): Promise<TiketWithDetails | null> {
    const existing = await prisma.tiket.findUnique({ where: { id_tiket: id } });
    if (!existing) return null;

    const newTahapId = data.id_tahap && data.id_tahap !== existing.id_tahap ? data.id_tahap : undefined;
    const jenis = newTahapId ? await jenisTahapOf(newTahapId) : undefined;
    const isDocumentStage = !!jenis && DOCUMENT_STAGES.includes(jenis);

    // Catat perpindahan tahap otomatis jika tahap berubah
    if (newTahapId) {
      await prisma.riwayatTahap
        .create({
          data: {
            id_tiket: id,
            id_tahap_asal: existing.id_tahap,
            id_tahap_tujuan: newTahapId,
            id_user: data.id_user ?? existing.id_user,
          },
        })
        .catch(() => null);
    }

    const updated = await prisma.tiket.update({
      where: { id_tiket: id },
      data: {
        ...(data.id_pelanggan !== undefined && {
          id_pelanggan: data.id_pelanggan,
        }),
        ...(data.id_user !== undefined && { id_user: data.id_user }),
        ...(data.id_tahap !== undefined && { id_tahap: data.id_tahap }),
        ...(data.id_kontak !== undefined && { id_kontak: data.id_kontak }),
        ...(data.judul !== undefined && { judul: data.judul }),
        ...(data.estimasi_nilai !== undefined && !isDocumentStage && {
          estimasi_nilai: data.estimasi_nilai,
        }),
        ...(data.estimasi_closing !== undefined && {
          estimasi_closing: new Date(data.estimasi_closing),
        }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.kebutuhan_pelanggan !== undefined && {
          kebutuhan_pelanggan: data.kebutuhan_pelanggan,
        }),
        ...(data.prioritas !== undefined && { prioritas: data.prioritas }),
        ...(data.posisi !== undefined && { posisi: data.posisi }),
        // Tanggal penawaran awal tidak boleh bergeser saat pindah antar kolom quotation.
        ...(data.tanggal_penawaran_awal !== undefined && !existing.tanggal_penawaran_awal && {
          tanggal_penawaran_awal: toDate(data.tanggal_penawaran_awal),
        }),
        ...(data.tanggal_closing !== undefined && {
          tanggal_closing: toDate(data.tanggal_closing),
        }),
        ...(data.alasan_lost !== undefined && {
          alasan_lost: data.alasan_lost,
        }),
      },
      include: ticketInclude,
    });

    if (jenis) {
      await applyStageEffects(
        id,
        jenis,
        data.estimasi_nilai ?? existing.estimasi_nilai,
        data.status ?? existing.status,
      );
      return this.getById(id);
    }

    return mapToTiketWithDetails(updated);
  },

  async delete(id: string): Promise<Tiket | null> {
    const existing = await prisma.tiket.findUnique({ where: { id_tiket: id } });
    if (!existing) return null;

    return prisma.tiket.delete({
      where: { id_tiket: id },
    });
  },
};