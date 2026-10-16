import { prisma } from "../../config/prisma.ts";
import type {
  Notifikasi,
  CreateNotifikasiInput,
  UpdateNotifikasiInput,
} from "./notifikasi.types.ts";

export const notifikasiRepository = {
  async create(data: CreateNotifikasiInput): Promise<Notifikasi> {
    return prisma.notifikasi.create({
      data: {
        id_tiket: data.id_tiket,
        title: data.title,
        isRead: data.isRead ?? false,
        message: data.message,
      },
    });
  },

  async getAll(): Promise<Notifikasi[]> {
    return prisma.notifikasi.findMany({
      orderBy: { created_at: "desc" },
    });
  },

  async getById(id: string): Promise<Notifikasi | null> {
    return prisma.notifikasi.findUnique({
      where: { id_notifikasi: id },
    });
  },

  async getByTiketId(idTiket: string): Promise<Notifikasi[]> {
    return prisma.notifikasi.findMany({
      where: { id_tiket: idTiket },
      orderBy: { created_at: "desc" },
    });
  },

  async markAsRead(id: string): Promise<Notifikasi | null> {
    const existing = await prisma.notifikasi.findUnique({ where: { id_notifikasi: id } });
    if (!existing) return null;

    return prisma.notifikasi.update({
      where: { id_notifikasi: id },
      data: { isRead: true },
    });
  },

  async update(id: string, data: UpdateNotifikasiInput): Promise<Notifikasi | null> {
    const existing = await prisma.notifikasi.findUnique({ where: { id_notifikasi: id } });
    if (!existing) return null;

    return prisma.notifikasi.update({
      where: { id_notifikasi: id },
      data,
    });
  },

  async delete(id: string): Promise<Notifikasi | null> {
    const existing = await prisma.notifikasi.findUnique({ where: { id_notifikasi: id } });
    if (!existing) return null;

    return prisma.notifikasi.delete({
      where: { id_notifikasi: id },
    });
  },
};
