import { prisma } from "../../config/prisma.ts";
import type {
  TahapKanban,
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

  async getAll(): Promise<TahapKanban[]> {
    return prisma.tahapKanban.findMany({
      orderBy: { urutan: "asc" },
    });
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
