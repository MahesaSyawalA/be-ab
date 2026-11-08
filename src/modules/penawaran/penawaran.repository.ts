import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import type {
  Penawaran,
  PenawaranFilters,
  CreatePenawaranInput,
  UpdatePenawaranInput,
} from "./penawaran.types.ts";

export const penawaranRepository = {
  async create(data: CreatePenawaranInput): Promise<Penawaran> {
    return prisma.penawaran.create({
      data: {
        id_tiket: data.id_tiket,
        id_aktivitas: data.id_aktivitas ?? null,
        no_penawaran: data.no_penawaran,
        revisi_ke: data.revisi_ke,
        tanggal_penawaran: new Date(data.tanggal_penawaran),
        total_nilai: data.total_nilai,
        status: data.status,
        url_file_penawaran: data.url_file_penawaran,
      },
    });
  },

  async getAll(
    filters: PenawaranFilters,
    pagination: PaginationParams,
  ): Promise<{ items: Penawaran[]; total: number }> {
    const where: Prisma.PenawaranWhereInput = {
      id_tiket: filters.id_tiket,
      id_aktivitas: filters.id_aktivitas,
      status: filters.status,
      AND: [
        ...(filters.no_penawaran ? [{ no_penawaran: filters.no_penawaran }] : []),
        ...(filters.search ? [{ no_penawaran: { contains: filters.search } }] : []),
      ],
    };

    const [items, total] = await prisma.$transaction([
      prisma.penawaran.findMany({
        where,
        orderBy: [{ created_at: pagination.order }, { id_penawaran: "asc" }],
        ...toSkipTake(pagination),
      }),
      prisma.penawaran.count({ where }),
    ]);

    return { items, total };
  },

  async getById(id: string): Promise<Penawaran | null> {
    return prisma.penawaran.findUnique({
      where: { id_penawaran: id },
    });
  },

  async getByNoPenawaran(noPenawaran: string): Promise<Penawaran | null> {
    return prisma.penawaran.findUnique({
      where: { no_penawaran: noPenawaran },
    });
  },

  async getByTiketId(idTiket: string): Promise<Penawaran[]> {
    return prisma.penawaran.findMany({
      where: { id_tiket: idTiket },
      orderBy: { created_at: "desc" },
    });
  },

  async getByAktivitasId(idAktivitas: string): Promise<Penawaran[]> {
    return prisma.penawaran.findMany({
      where: { id_aktivitas: idAktivitas },
      orderBy: { created_at: "desc" },
    });
  },

  async update(id: string, data: UpdatePenawaranInput): Promise<Penawaran | null> {
    const existing = await prisma.penawaran.findUnique({ where: { id_penawaran: id } });
    if (!existing) return null;

    return prisma.penawaran.update({
      where: { id_penawaran: id },
      data: {
        ...(data.id_tiket !== undefined && { id_tiket: data.id_tiket }),
        ...(data.id_aktivitas !== undefined && { id_aktivitas: data.id_aktivitas }),
        ...(data.no_penawaran !== undefined && { no_penawaran: data.no_penawaran }),
        ...(data.revisi_ke !== undefined && { revisi_ke: data.revisi_ke }),
        ...(data.tanggal_penawaran !== undefined && { tanggal_penawaran: new Date(data.tanggal_penawaran) }),
        ...(data.total_nilai !== undefined && { total_nilai: data.total_nilai }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.url_file_penawaran !== undefined && { url_file_penawaran: data.url_file_penawaran }),
      },
    });
  },

  async delete(id: string): Promise<Penawaran | null> {
    const existing = await prisma.penawaran.findUnique({ where: { id_penawaran: id } });
    if (!existing) return null;

    return prisma.penawaran.delete({
      where: { id_penawaran: id },
    });
  },
};