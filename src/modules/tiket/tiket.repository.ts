import { prisma } from "../../config/prisma.ts";
import type { Tiket, CreateTiketInput, UpdateTiketInput } from "./tiket.types.ts";

function toDate(val?: string | Date | null): Date | null | undefined {
  if (val === undefined) return undefined;
  if (val === null) return null;
  return new Date(val);
}

export const tiketRepository = {
  async create(data: CreateTiketInput): Promise<Tiket> {
    return prisma.tiket.create({
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
    });
  },

  async getAll(): Promise<Tiket[]> {
    return prisma.tiket.findMany({
      orderBy: { created_at: "desc" },
    });
  },

  async getById(id: string): Promise<Tiket | null> {
    return prisma.tiket.findUnique({
      where: { id_tiket: id },
    });
  },

  async getByPelangganId(idPelanggan: string): Promise<Tiket[]> {
    return prisma.tiket.findMany({
      where: { id_pelanggan: idPelanggan },
      orderBy: { created_at: "desc" },
    });
  },

  async getByUserId(idUser: string): Promise<Tiket[]> {
    return prisma.tiket.findMany({
      where: { id_user: idUser },
      orderBy: { created_at: "desc" },
    });
  },

  async getByTahapId(idTahap: string): Promise<Tiket[]> {
    return prisma.tiket.findMany({
      where: { id_tahap: idTahap },
      orderBy: { posisi: "asc" },
    });
  },

  async getByKontakId(idKontak: string): Promise<Tiket[]> {
    return prisma.tiket.findMany({
      where: { id_kontak: idKontak },
      orderBy: { created_at: "desc" },
    });
  },

  async update(id: string, data: UpdateTiketInput): Promise<Tiket | null> {
    const existing = await prisma.tiket.findUnique({ where: { id_tiket: id } });
    if (!existing) return null;

    return prisma.tiket.update({
      where: { id_tiket: id },
      data: {
        ...(data.id_pelanggan !== undefined && { id_pelanggan: data.id_pelanggan }),
        ...(data.id_user !== undefined && { id_user: data.id_user }),
        ...(data.id_tahap !== undefined && { id_tahap: data.id_tahap }),
        ...(data.id_kontak !== undefined && { id_kontak: data.id_kontak }),
        ...(data.judul !== undefined && { judul: data.judul }),
        ...(data.estimasi_nilai !== undefined && { estimasi_nilai: data.estimasi_nilai }),
        ...(data.estimasi_closing !== undefined && { estimasi_closing: new Date(data.estimasi_closing) }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.kebutuhan_pelanggan !== undefined && { kebutuhan_pelanggan: data.kebutuhan_pelanggan }),
        ...(data.prioritas !== undefined && { prioritas: data.prioritas }),
        ...(data.posisi !== undefined && { posisi: data.posisi }),
        ...(data.tanggal_penawaran_awal !== undefined && { tanggal_penawaran_awal: toDate(data.tanggal_penawaran_awal) }),
        ...(data.tanggal_closing !== undefined && { tanggal_closing: toDate(data.tanggal_closing) }),
        ...(data.alasan_lost !== undefined && { alasan_lost: data.alasan_lost }),
      },
    });
  },

  async delete(id: string): Promise<Tiket | null> {
    const existing = await prisma.tiket.findUnique({ where: { id_tiket: id } });
    if (!existing) return null;

    return prisma.tiket.delete({
      where: { id_tiket: id },
    });
  },
};
