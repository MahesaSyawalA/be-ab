import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import type {
  TahapKanban,
  TahapKanbanFilters,
  CreateTahapKanbanInput,
  UpdateTahapKanbanInput,
} from "./tahap-kanban.types.ts";

export const tahapKanbanRepository = {
  async create(data: CreateTahapKanbanInput): Promise<TahapKanban> {
    return prisma.tahapKanban.create({
      data: {
        nama_tahap: data.nama_tahap,
        urutan: data.urutan,
        jenis_tahap: data.jenis_tahap,
        is_tahap_akhir: data.is_tahap_akhir,
        is_aktif: data.is_aktif,
        dot_color: data.dotColor,
      },
    });
  },

  async getAll(
    filters: TahapKanbanFilters,
    pagination: PaginationParams,
  ): Promise<{ items: TahapKanban[]; total: number }> {
    const where: Prisma.TahapKanbanWhereInput = {
      jenis_tahap: filters.jenis_tahap,
      is_aktif: filters.is_aktif,
      is_tahap_akhir: filters.is_tahap_akhir,
      ...(filters.search && { nama_tahap: { contains: filters.search } }),
    };

    const [items, total] = await prisma.$transaction([
      prisma.tahapKanban.findMany({
        where,
        orderBy: [{ urutan: pagination.order }, { id_tahap: "asc" }],
        ...toSkipTake(pagination),
      }),
      prisma.tahapKanban.count({ where }),
    ]);

    return { items, total };
  },

  async getById(id: string): Promise<TahapKanban | null> {
    return prisma.tahapKanban.findUnique({
      where: { id_tahap: id },
    });
  },

  async update(
    id: string,
    data: UpdateTahapKanbanInput,
  ): Promise<TahapKanban | null> {
    const existing = await prisma.tahapKanban.findUnique({
      where: { id_tahap: id },
    });
    if (!existing) return null;

    return prisma.tahapKanban.update({
      where: { id_tahap: id },
      data,
    });
  },

  async delete(id: string): Promise<TahapKanban | null> {
    const existing = await prisma.tahapKanban.findUnique({
      where: { id_tahap: id },
    });
    if (!existing) return null;

    return prisma.tahapKanban.delete({
      where: { id_tahap: id },
    });
  },
};