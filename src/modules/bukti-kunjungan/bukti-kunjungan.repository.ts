import { prisma } from "../../config/prisma.ts";
import type {
  BuktiKunjungan,
  CreateBuktiKunjunganInput,
  UpdateBuktiKunjunganInput,
} from "./bukti-kunjungan.types.ts";

export const buktiKunjunganRepository = {
  async create(data: CreateBuktiKunjunganInput): Promise<BuktiKunjungan> {
    return prisma.buktiKunjungan.create({
      data: {
        id_aktivitas: data.id_aktivitas,
        longitude: data.longitude,
        latitude: data.latitude,
        jarak_klien: data.jarak_klien,
        dalam_radius: data.dalam_radius,
        img_url: data.img_url,
      },
    });
  },

  async getAll(): Promise<BuktiKunjungan[]> {
    return prisma.buktiKunjungan.findMany({
      orderBy: { created_at: "desc" },
    });
  },

  async getById(id: string): Promise<BuktiKunjungan | null> {
    return prisma.buktiKunjungan.findUnique({
      where: { id_bukti: id },
    });
  },

  async getByAktivitasId(idAktivitas: string): Promise<BuktiKunjungan[]> {
    return prisma.buktiKunjungan.findMany({
      where: { id_aktivitas: idAktivitas },
      orderBy: { created_at: "desc" },
    });
  },

  async update(id: string, data: UpdateBuktiKunjunganInput): Promise<BuktiKunjungan | null> {
    const existing = await prisma.buktiKunjungan.findUnique({ where: { id_bukti: id } });
    if (!existing) return null;

    return prisma.buktiKunjungan.update({
      where: { id_bukti: id },
      data,
    });
  },

  async delete(id: string): Promise<BuktiKunjungan | null> {
    const existing = await prisma.buktiKunjungan.findUnique({ where: { id_bukti: id } });
    if (!existing) return null;

    return prisma.buktiKunjungan.delete({
      where: { id_bukti: id },
    });
  },
};
