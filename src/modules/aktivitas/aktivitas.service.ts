import { randomUUID } from "node:crypto";
import { aktivitasRepository } from "./aktivitas.repository.ts";
import type { Aktivitas, CreateAktivitasInput } from "./aktivitas.types.ts";

export const aktivitasService = {
  async create(data: CreateAktivitasInput): Promise<Aktivitas> {
    const now_timestamptz = new Date().toISOString();

    const aktivitas: Aktivitas = {
      id_aktivitas: randomUUID(),
      id_user: data.id_user,
      id_tiket: data.id_tiket,
      tanggal: data.tanggal,
      catatan: data.catatan,
      jenis_kegiatan: data.jenis_kegiatan,
      jadwal_follow_up: data.jadwal_follow_up ?? null,
      created_at: now_timestamptz,
      updated_at: now_timestamptz,
    };

    return aktivitasRepository.create(aktivitas);
  },

  async getAll(): Promise<Aktivitas[]> {
    return aktivitasRepository.getAll();
  },

  async getById(id: string): Promise<Aktivitas | undefined> {
    return aktivitasRepository.getById(id);
  },

  async getByUserId(idUser: string): Promise<Aktivitas[]> {
    return aktivitasRepository.getByUserId(idUser);
  },

  async getByTiketId(idTiket: string): Promise<Aktivitas[]> {
    return aktivitasRepository.getByTiketId(idTiket);
  },
};
