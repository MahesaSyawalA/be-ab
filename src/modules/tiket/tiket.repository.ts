import { prisma } from "../../config/prisma.ts";
import type {
  Tiket,
  TiketWithDetails,
  CreateTiketInput,
  UpdateTiketInput,
} from "./tiket.types.ts";

function toDate(val?: string | Date | null): Date | null | undefined {
  if (val === undefined) return undefined;
  if (val === null) return null;
  return new Date(val);
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
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    kode_tiket,
    nama_outlet: raw.pelanggan?.nama_outlet ?? "",
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

    return mapToTiketWithDetails(created);
  },

  async getAll(): Promise<TiketWithDetails[]> {
    const rows = await prisma.tiket.findMany({
      include: ticketInclude,
      orderBy: { created_at: "desc" },
    });
    return rows.map(mapToTiketWithDetails);
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

    // Catat perpindahan tahap otomatis jika tahap berubah
    if (data.id_tahap && data.id_tahap !== existing.id_tahap) {
      await prisma.riwayatTahap
        .create({
          data: {
            id_tiket: id,
            id_tahap_asal: existing.id_tahap,
            id_tahap_tujuan: data.id_tahap,
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
        ...(data.estimasi_nilai !== undefined && {
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
        ...(data.tanggal_penawaran_awal !== undefined && {
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
