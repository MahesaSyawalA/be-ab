import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import type {
  Aktivitas,
  AktivitasFilters,
  CreateAktivitasInput,
  UpdateAktivitasInput,
} from "./aktivitas.types.ts";

function toDate(val?: string | Date | null): Date | null | undefined {
  if (val === undefined) return undefined;
  if (val === null) return null;
  return new Date(val);
}

const penawaranSelect = {
  id_penawaran: true,
  no_penawaran: true,
  revisi_ke: true,
  total_nilai: true,
  status: true,
} satisfies Prisma.PenawaranSelect;

const listInclude = {
  user: { select: { nama: true, role: true } },
  bukti_kunjungan: true,
  evidence: true,
  penawaran: {
    select: penawaranSelect,
    orderBy: { created_at: "desc" as const },
  },
} satisfies Prisma.AktivitasInclude;

export const aktivitasRepository = {
  async create(data: CreateAktivitasInput): Promise<Aktivitas> {
    return prisma.aktivitas.create({
      data: {
        id_user: data.id_user,
        id_tiket: data.id_tiket,
        tanggal: new Date(data.tanggal),
        catatan: data.catatan,
        jenis_kegiatan: data.jenis_kegiatan,
        jadwal_follow_up: toDate(data.jadwal_follow_up),
      },
    });
  },

  async getAll(filters: AktivitasFilters, pagination: PaginationParams) {
    const where: Prisma.AktivitasWhereInput = {
      id_user: filters.id_user,
      id_tiket: filters.id_tiket,
      jenis_kegiatan: filters.jenis_kegiatan,
      ...(filters.search && { catatan: { contains: filters.search } }),
    };

    const [items, total] = await prisma.$transaction([
      prisma.aktivitas.findMany({
        where,
        include: listInclude,
        orderBy: [{ tanggal: pagination.order }, { id_aktivitas: "asc" }],
        ...toSkipTake(pagination),
      }),
      prisma.aktivitas.count({ where }),
    ]);

    return { items, total };
  },

  async getById(id: string) {
    return prisma.aktivitas.findUnique({
      where: { id_aktivitas: id },
      include: listInclude,
    });
  },

  async getByUserId(idUser: string): Promise<Aktivitas[]> {
    return prisma.aktivitas.findMany({
      where: { id_user: idUser },
      orderBy: { tanggal: "desc" },
    });
  },

  async getByTiketId(idTiket: string) {
    return prisma.aktivitas.findMany({
      where: { id_tiket: idTiket },
      include: listInclude,
      orderBy: { tanggal: "desc" },
    });
  },

  async update(
    id: string,
    data: UpdateAktivitasInput,
  ): Promise<Aktivitas | null> {
    const existing = await prisma.aktivitas.findUnique({
      where: { id_aktivitas: id },
    });
    if (!existing) return null;

    return prisma.aktivitas.update({
      where: { id_aktivitas: id },
      data: {
        ...(data.id_user !== undefined && { id_user: data.id_user }),
        ...(data.id_tiket !== undefined && { id_tiket: data.id_tiket }),
        ...(data.tanggal !== undefined && { tanggal: new Date(data.tanggal) }),
        ...(data.catatan !== undefined && { catatan: data.catatan }),
        ...(data.jenis_kegiatan !== undefined && {
          jenis_kegiatan: data.jenis_kegiatan,
        }),
        ...(data.jadwal_follow_up !== undefined && {
          jadwal_follow_up: toDate(data.jadwal_follow_up),
        }),
      },
    });
  },

  async delete(id: string): Promise<Aktivitas | null> {
    const existing = await prisma.aktivitas.findUnique({
      where: { id_aktivitas: id },
    });
    if (!existing) return null;

    return prisma.aktivitas.delete({
      where: { id_aktivitas: id },
    });
  },
};