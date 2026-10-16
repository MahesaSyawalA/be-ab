import { prisma } from "../../config/prisma.ts";
import type { Pelanggan, CreatePelangganInput, UpdatePelangganInput } from "./pelanggan.types.ts";

export const pelangganRepository = {
  async create(data: CreatePelangganInput): Promise<Pelanggan> {
    return prisma.pelanggan.create({
      data: {
        nama_faskes: data.nama_faskes,
        tipe_faskes: data.tipe_faskes,
        alamat: data.alamat,
        latitude: data.latitude,
        longitude: data.longitude,
        radius_kunjungan: data.radius_kunjungan,
        img_url: data.img_url,
      },
    });
  },

  async getAll(): Promise<Pelanggan[]> {
    return prisma.pelanggan.findMany({
      orderBy: { created_at: "desc" },
    });
  },

  async getById(id: string): Promise<Pelanggan | null> {
    return prisma.pelanggan.findUnique({
      where: { id_pelanggan: id },
    });
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
