import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import type {
  BuktiKunjungan,
  BuktiKunjunganFilters,
  CreateBuktiKunjunganInput,
  UpdateBuktiKunjunganInput,
} from "./bukti-kunjungan.types.ts";

export const buktiKunjunganRepository = {
  async create(data: CreateBuktiKunjunganInput): Promise<BuktiKunjungan> {
    const img_url = data.img_url || data.file_url || "";
    return prisma.buktiKunjungan.create({
      data: {
        id_aktivitas: data.id_aktivitas,
        longitude: data.longitude,
        latitude: data.latitude,
        jarak_klien: data.jarak_klien,
        dalam_radius: data.dalam_radius,
        img_url,
        file_url: data.file_url ?? null,
      },
    });
  },

  async getAll(
    filters: BuktiKunjunganFilters,
    pagination: PaginationParams,
  ): Promise<{ items: BuktiKunjungan[]; total: number }> {
    const where: Prisma.BuktiKunjunganWhereInput = {
      id_aktivitas: filters.id_aktivitas,
      dalam_radius: filters.dalam_radius,
    };

    const [items, total] = await prisma.$transaction([
      prisma.buktiKunjungan.findMany({
        where,
        orderBy: [{ created_at: pagination.order }, { id_bukti: "asc" }],
        ...toSkipTake(pagination),
      }),
      prisma.buktiKunjungan.count({ where }),
    ]);

    return { items, total };
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

  async update(
    id: string,
    data: UpdateBuktiKunjunganInput,
  ): Promise<BuktiKunjungan | null> {
    const existing = await prisma.buktiKunjungan.findUnique({
      where: { id_bukti: id },
    });
    if (!existing) return null;

    return prisma.buktiKunjungan.update({
      where: { id_bukti: id },
      data: {
        ...(data.id_aktivitas !== undefined && {
          id_aktivitas: data.id_aktivitas,
        }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.jarak_klien !== undefined && {
          jarak_klien: data.jarak_klien,
        }),
        ...(data.dalam_radius !== undefined && {
          dalam_radius: data.dalam_radius,
        }),
        ...(data.img_url !== undefined && { img_url: data.img_url }),
        ...(data.file_url !== undefined && { file_url: data.file_url }),
      },
    });
  },

  async delete(id: string): Promise<BuktiKunjungan | null> {
    const existing = await prisma.buktiKunjungan.findUnique({
      where: { id_bukti: id },
    });
    if (!existing) return null;

    return prisma.buktiKunjungan.delete({
      where: { id_bukti: id },
    });
  },
};