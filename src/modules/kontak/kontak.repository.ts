import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import type {
  Kontak,
  KontakFilters,
  CreateKontakInput,
  UpdateKontakInput,
} from "./kontak.types.ts";

export const kontakRepository = {
  async create(data: CreateKontakInput): Promise<Kontak> {
    return prisma.kontak.create({
      data: {
        id_pelanggan: data.id_pelanggan,
        nama: data.nama,
        jabatan: data.jabatan,
        no_telp: data.no_telp,
        email: data.email,
        kategori_peran: data.kategori_peran ?? null,
        inisial: data.inisial ?? null,
      },
    });
  },

  async getAll(
    filters: KontakFilters,
    pagination: PaginationParams,
  ): Promise<{ items: Kontak[]; total: number }> {
    const where: Prisma.KontakWhereInput = {
      id_pelanggan: filters.id_pelanggan,
      ...(filters.search && {
        OR: [
          { nama: { contains: filters.search } },
          { jabatan: { contains: filters.search } },
          { email: { contains: filters.search } },
        ],
      }),
    };

    const [items, total] = await prisma.$transaction([
      prisma.kontak.findMany({
        where,
        orderBy: [{ created_at: pagination.order }, { id_kontak: "asc" }],
        ...toSkipTake(pagination),
      }),
      prisma.kontak.count({ where }),
    ]);

    return { items, total };
  },

  async getById(id: string): Promise<Kontak | null> {
    return prisma.kontak.findUnique({
      where: { id_kontak: id },
    });
  },

  async getByPelangganId(idPelanggan: string): Promise<Kontak[]> {
    return prisma.kontak.findMany({
      where: { id_pelanggan: idPelanggan },
    });
  },

  async update(id: string, data: UpdateKontakInput): Promise<Kontak | null> {
    const existing = await prisma.kontak.findUnique({ where: { id_kontak: id } });
    if (!existing) return null;

    return prisma.kontak.update({
      where: { id_kontak: id },
      data: {
        ...(data.id_pelanggan !== undefined && { id_pelanggan: data.id_pelanggan }),
        ...(data.nama !== undefined && { nama: data.nama }),
        ...(data.jabatan !== undefined && { jabatan: data.jabatan }),
        ...(data.no_telp !== undefined && { no_telp: data.no_telp }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.kategori_peran !== undefined && { kategori_peran: data.kategori_peran }),
        ...(data.inisial !== undefined && { inisial: data.inisial }),
      },
    });
  },

  async delete(id: string): Promise<Kontak | null> {
    const existing = await prisma.kontak.findUnique({ where: { id_kontak: id } });
    if (!existing) return null;

    return prisma.kontak.delete({
      where: { id_kontak: id },
    });
  },
};