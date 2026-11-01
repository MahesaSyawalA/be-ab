import { prisma } from "../../config/prisma.ts";
import type {
  Aktivitas,
  CreateAktivitasInput,
  UpdateAktivitasInput,
} from "./aktivitas.types.ts";

function toDate(val?: string | Date | null): Date | null | undefined {
  if (val === undefined) return undefined;
  if (val === null) return null;
  return new Date(val);
}

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

  async getAll(): Promise<Aktivitas[]> {
    return prisma.aktivitas.findMany({
      orderBy: { tanggal: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.aktivitas.findUnique({
      where: { id_aktivitas: id },
      include: {
        user: {
          select: {
            nama: true,
            role: true,
          },
        },
        bukti_kunjungan: true,
        evidence: true,
      },
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
      include: {
        user: {
          select: {
            nama: true,
          },
        },
        bukti_kunjungan: true,
        evidence: true,
      },
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
