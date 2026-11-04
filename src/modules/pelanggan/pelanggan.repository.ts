import { prisma } from "../../config/prisma.ts";
import type {
  Pelanggan,
  PelangganWithDetails,
  CreatePelangganInput,
  UpdatePelangganInput,
} from "./pelanggan.types.ts";

function mapToPelangganWithDetails(p: any): PelangganWithDetails {
  const nama = p.nama_outlet ?? p.nama_faskes ?? "";
  const tipe = p.tipe_outlet ?? p.tipe_faskes ?? "";
  return {
    ...p,
    nama_outlet: nama,
    tipe_outlet: tipe,
    nama_faskes: nama,
    tipe_faskes: tipe,
    tiket_aktif: p._count?.tiket ?? 0,
    kontak_list: p.kontak ?? [],
  };
}

export const pelangganRepository = {
  async create(data: CreatePelangganInput): Promise<PelangganWithDetails> {
    const { kontak, ...rest } = data;
    const nama_outlet = rest.nama_outlet || rest.nama_faskes || "";
    const tipe_outlet = rest.tipe_outlet || rest.tipe_faskes || "Rumah Sakit";

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
      include: {
        kontak: true,
        _count: {
          select: { tiket: true },
        },
      },
    });

    return mapToPelangganWithDetails(created);
  },

  async getAll(): Promise<PelangganWithDetails[]> {
    const list = await prisma.pelanggan.findMany({
      include: {
        kontak: true,
        _count: {
          select: { tiket: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return list.map(mapToPelangganWithDetails);
  },

  async getById(id: string): Promise<PelangganWithDetails | null> {
    const p = await prisma.pelanggan.findUnique({
      where: { id_pelanggan: id },
      include: {
        kontak: true,
        _count: {
          select: { tiket: true },
        },
      },
    });

    if (!p) return null;

    return mapToPelangganWithDetails(p);
  },

  async update(
    id: string,
    data: UpdatePelangganInput,
  ): Promise<Pelanggan | null> {
    const existing = await prisma.pelanggan.findUnique({
      where: { id_pelanggan: id },
    });
    if (!existing) return null;

    const nama_outlet = data.nama_outlet ?? data.nama_faskes;
    const tipe_outlet = data.tipe_outlet ?? data.tipe_faskes;

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
      include: {
        kontak: true,
        _count: {
          select: { tiket: true },
        },
      },
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
