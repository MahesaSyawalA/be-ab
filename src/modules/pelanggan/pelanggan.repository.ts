import { prisma } from "../../config/prisma.ts";
import type {
  Pelanggan,
  PelangganWithDetails,
  CreatePelangganInput,
  UpdatePelangganInput,
} from "./pelanggan.types.ts";

export const pelangganRepository = {
  async create(data: CreatePelangganInput): Promise<PelangganWithDetails> {
    const { kontak, ...rest } = data;
    const created = await prisma.pelanggan.create({
      data: {
        nama_faskes: rest.nama_faskes,
        tipe_faskes: rest.tipe_faskes,
        alamat: rest.alamat,
        latitude: rest.latitude,
        longitude: rest.longitude,
        radius_kunjungan: rest.radius_kunjungan,
        img_url: rest.img_url,
        ...(kontak && kontak.length > 0 && {
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
      },
    });

    return {
      ...created,
      kontak_list: created.kontak,
    };
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

    return list.map((p) => ({
      ...p,
      tiket_aktif: p._count.tiket,
      kontak_list: p.kontak,
    }));
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

    return {
      ...p,
      tiket_aktif: p._count.tiket,
      kontak_list: p.kontak,
    };
  },

  async update(id: string, data: UpdatePelangganInput): Promise<Pelanggan | null> {
    const existing = await prisma.pelanggan.findUnique({ where: { id_pelanggan: id } });
    if (!existing) return null;

    return prisma.pelanggan.update({
      where: { id_pelanggan: id },
      data,
    });
  },

  async delete(id: string): Promise<Pelanggan | null> {
    const existing = await prisma.pelanggan.findUnique({ where: { id_pelanggan: id } });
    if (!existing) return null;

    return prisma.pelanggan.delete({
      where: { id_pelanggan: id },
    });
  },
};
