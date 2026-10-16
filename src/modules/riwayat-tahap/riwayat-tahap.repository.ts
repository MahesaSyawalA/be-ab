import { prisma } from "../../config/prisma.ts";
import type {
  RiwayatTahap,
  CreateRiwayatTahapInput,
  UpdateRiwayatTahapInput,
} from "./riwayat-tahap.types.ts";

export const riwayatTahapRepository = {
  async create(data: CreateRiwayatTahapInput): Promise<RiwayatTahap> {
    return prisma.riwayatTahap.create({
      data: {
        id_tiket: data.id_tiket,
        id_tahap_asal: data.id_tahap_asal ?? null,
        id_tahap_tujuan: data.id_tahap_tujuan,
        id_user: data.id_user,
        ...(data.waktu_pindah && { waktu_pindah: new Date(data.waktu_pindah) }),
      },
    });
  },

  async getAll(): Promise<RiwayatTahap[]> {
    return prisma.riwayatTahap.findMany({
      orderBy: { waktu_pindah: "desc" },
    });
  },

  async getById(id: string): Promise<RiwayatTahap | null> {
    return prisma.riwayatTahap.findUnique({
      where: { id_riwayat: id },
    });
  },

  async getByTiketId(idTiket: string): Promise<RiwayatTahap[]> {
    return prisma.riwayatTahap.findMany({
      where: { id_tiket: idTiket },
      orderBy: { waktu_pindah: "desc" },
    });
  },

  async update(id: string, data: UpdateRiwayatTahapInput): Promise<RiwayatTahap | null> {
    const existing = await prisma.riwayatTahap.findUnique({ where: { id_riwayat: id } });
    if (!existing) return null;

    return prisma.riwayatTahap.update({
      where: { id_riwayat: id },
      data: {
        ...(data.id_tiket !== undefined && { id_tiket: data.id_tiket }),
        ...(data.id_tahap_asal !== undefined && { id_tahap_asal: data.id_tahap_asal }),
        ...(data.id_tahap_tujuan !== undefined && { id_tahap_tujuan: data.id_tahap_tujuan }),
        ...(data.id_user !== undefined && { id_user: data.id_user }),
        ...(data.waktu_pindah !== undefined && { waktu_pindah: new Date(data.waktu_pindah) }),
      },
    });
  },

  async delete(id: string): Promise<RiwayatTahap | null> {
    const existing = await prisma.riwayatTahap.findUnique({ where: { id_riwayat: id } });
    if (!existing) return null;

    return prisma.riwayatTahap.delete({
      where: { id_riwayat: id },
    });
  },
};
