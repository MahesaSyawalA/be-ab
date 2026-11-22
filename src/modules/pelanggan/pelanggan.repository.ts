import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import type {
  Pelanggan,
  PelangganFilters,
  PelangganWithDetails,
  CreatePelangganData,
  UpdatePelangganData,
} from "./pelanggan.types.ts";

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function mapToPelangganWithDetails(p: any): PelangganWithDetails {
  const nama = p.nama_outlet ?? p.nama_faskes ?? "";
  const tipe = p.tipe_outlet ?? p.tipe_faskes ?? "";

  let total_kunjungan = 0;
  let total_estimasi = 0;

  if (Array.isArray(p.tiket)) {
    p.tiket.forEach((t: any) => {
      if (t.estimasi_nilai) {
        total_estimasi += Number(t.estimasi_nilai);
      }
      if (Array.isArray(t.aktivitas)) {
        t.aktivitas.forEach((a: any) => {
          if (a.jenis_kegiatan === "kunjungan") {
            total_kunjungan += 1;
          } else if (a.bukti_kunjungan && a.bukti_kunjungan.length > 0) {
            total_kunjungan += a.bukti_kunjungan.length;
          }
        });
      }
    });
  }

  const activeTicketCount =
    p._count?.tiket ?? (Array.isArray(p.tiket) ? p.tiket.length : 0);

  return {
    ...p,
    nama_outlet: nama,
    tipe_outlet: tipe,
    nama_faskes: nama,
    tipe_faskes: tipe,
    tiket_aktif: activeTicketCount,
    total_kunjungan,
    estimasi_nilai: formatRupiah(total_estimasi),
    kontak_list: p.kontak ?? [],
  };
}

const customerInclude = {
  kontak: true,
  tiket: {
    select: {
      id_tiket: true,
      estimasi_nilai: true,
      aktivitas: {
        select: {
          id_aktivitas: true,
          jenis_kegiatan: true,
          bukti_kunjungan: {
            select: { id_bukti: true },
          },
        },
      },
    },
  },
  _count: {
    select: { tiket: true },
  },
} as const;

export const pelangganRepository = {
  async create(data: CreatePelangganData): Promise<PelangganWithDetails> {
    const { kontak, ...rest } = data;
    const nama_outlet = rest.nama_outlet || "";
    const tipe_outlet = rest.tipe_outlet || "Rumah Sakit";

    const created = await prisma.pelanggan.create({
      data: {
        nama_outlet,
        tipe_outlet,
        alamat: rest.alamat,
        latitude: rest.latitude,
        longitude: rest.longitude,
        radius_kunjungan: rest.radius_kunjungan,
        img_url: rest.img_url,
        ...(kontak &&
          kontak.length > 0 && {
            kontak: {
              create: kontak.map((k) => ({
                nama: k.nama,
                jabatan: k.jabatan,
                no_telp: k.no_telp,
                email: k.email,
              })),
            },
          }),
      },
      include: customerInclude,
    });

    return mapToPelangganWithDetails(created);
  },

  async getAll(
    filters: PelangganFilters,
    pagination: PaginationParams,
  ): Promise<{ items: PelangganWithDetails[]; total: number }> {
    const where: Prisma.PelangganWhereInput = {
      tipe_outlet: filters.tipe_outlet,
      status: filters.status,
      ...(filters.search && {
        OR: [
          { nama_outlet: { contains: filters.search } },
          { alamat: { contains: filters.search } },
        ],
      }),
    };

    const [list, total] = await prisma.$transaction([
      prisma.pelanggan.findMany({
        where,
        include: customerInclude,
        orderBy: [{ created_at: pagination.order }, { id_pelanggan: "asc" }],
        ...toSkipTake(pagination),
      }),
      prisma.pelanggan.count({ where }),
    ]);

    return { items: list.map(mapToPelangganWithDetails), total };
  },

  async getById(id: string): Promise<PelangganWithDetails | null> {
    const p = await prisma.pelanggan.findUnique({
      where: { id_pelanggan: id },
      include: customerInclude,
    });

    if (!p) return null;

    return mapToPelangganWithDetails(p);
  },

  async update(
    id: string,
    data: UpdatePelangganData,
  ): Promise<Pelanggan | null> {
    const existing = await prisma.pelanggan.findUnique({
      where: { id_pelanggan: id },
    });
    if (!existing) return null;

    const nama_outlet = data.nama_outlet;
    const tipe_outlet = data.tipe_outlet;

    const updated = await prisma.pelanggan.update({
      where: { id_pelanggan: id },
      data: {
        ...(nama_outlet !== undefined && { nama_outlet }),
        ...(tipe_outlet !== undefined && { tipe_outlet }),
        ...(data.alamat !== undefined && { alamat: data.alamat }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.radius_kunjungan !== undefined && {
          radius_kunjungan: data.radius_kunjungan,
        }),
        ...(data.img_url !== undefined && { img_url: data.img_url }),
      },
      include: customerInclude,
    });

    return mapToPelangganWithDetails(updated);
  },

  async delete(id: string): Promise<Pelanggan | null> {
    const existing = await prisma.pelanggan.findUnique({
      where: { id_pelanggan: id },
    });
    if (!existing) return null;

    return prisma.pelanggan.delete({
      where: { id_pelanggan: id },
    });
  },
};
