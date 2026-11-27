import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import type {
  Notifikasi,
  NotifikasiFilters,
  CreateNotifikasiInput,
  UpdateNotifikasiInput,
} from "./notifikasi.types.ts";

export const notifikasiRepository = {
  async create(data: CreateNotifikasiInput): Promise<Notifikasi> {
    return prisma.notifikasi.create({
      data: {
        id_user: data.id_user,
        id_tiket: data.id_tiket,
        title: data.title,
        isRead: data.isRead ?? false,
        message: data.message,
      },
    });
  },

  async getAll(
    filters: NotifikasiFilters,
    pagination: PaginationParams,
  ): Promise<{ items: Notifikasi[]; total: number }> {
    const where: Prisma.NotifikasiWhereInput = {
      id_user: filters.id_user,
      id_tiket: filters.id_tiket,
      isRead: filters.isRead,
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search } },
          { message: { contains: filters.search } },
        ],
      }),
    };

    const [items, total] = await prisma.$transaction([
      prisma.notifikasi.findMany({
        where,
        orderBy: [{ created_at: pagination.order }, { id_notifikasi: "asc" }],
        ...toSkipTake(pagination),
      }),
      prisma.notifikasi.count({ where }),
    ]);

    return { items, total };
  },

  async getById(id: string, idUser: string): Promise<Notifikasi | null> {
    return prisma.notifikasi.findFirst({
      where: { id_notifikasi: id, id_user: idUser },
    });
  },

  async countUnread(idUser: string): Promise<number> {
    return prisma.notifikasi.count({ where: { id_user: idUser, isRead: false } });
  },

  async markAllAsRead(idUser: string): Promise<number> {
    const { count } = await prisma.notifikasi.updateMany({
      where: { id_user: idUser, isRead: false },
      data: { isRead: true },
    });
    return count;
  },

  async getByTiketId(idTiket: string): Promise<Notifikasi[]> {
    return prisma.notifikasi.findMany({
      where: { id_tiket: idTiket },
      orderBy: { created_at: "desc" },
    });
  },

  async markAsRead(id: string, idUser: string): Promise<Notifikasi | null> {
    const existing = await prisma.notifikasi.findFirst({
      where: { id_notifikasi: id, id_user: idUser },
    });
    if (!existing) return null;

    return prisma.notifikasi.update({
      where: { id_notifikasi: id },
      data: { isRead: true },
    });
  },

  async update(id: string, idUser: string, data: UpdateNotifikasiInput): Promise<Notifikasi | null> {
    const existing = await prisma.notifikasi.findFirst({
      where: { id_notifikasi: id, id_user: idUser },
    });
    if (!existing) return null;

    return prisma.notifikasi.update({
      where: { id_notifikasi: id },
      data,
    });
  },

  async delete(id: string, idUser: string): Promise<Notifikasi | null> {
    const existing = await prisma.notifikasi.findFirst({
      where: { id_notifikasi: id, id_user: idUser },
    });
    if (!existing) return null;

    return prisma.notifikasi.delete({
      where: { id_notifikasi: id },
    });
  },
};