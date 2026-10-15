import { randomUUID } from "node:crypto";
import { penawaranRepository } from "./penawaran.repository.ts";
import type { Penawaran, CreatePenawaranInput } from "./penawaran.types.ts";

export const penawaranService = {
  async create(data: CreatePenawaranInput): Promise<Penawaran> {
    const existing = await penawaranRepository.getByNoPenawaran(data.no_penawaran);
    if (existing) {
      throw new Error(`Nomor penawaran '${data.no_penawaran}' already exists.`);
    }

    const now_timestamptz = new Date().toISOString();

    const penawaran: Penawaran = {
      id_penawaran: randomUUID(),
      id_tiket: data.id_tiket,
      id_aktivitas: data.id_aktivitas ?? null,
      no_penawaran: data.no_penawaran,
      revisi_ke: data.revisi_ke,
      tanggal_penawaran: data.tanggal_penawaran,
      total_nilai: data.total_nilai,
      status: data.status,
      url_file_penawaran: data.url_file_penawaran,
      created_at: now_timestamptz,
      updated_at: now_timestamptz,
    };

    return penawaranRepository.create(penawaran);
  },

  async getAll(): Promise<Penawaran[]> {
    return penawaranRepository.getAll();
  },

  async getById(id: string): Promise<Penawaran | undefined> {
    return penawaranRepository.getById(id);
  },

  async getByTiketId(idTiket: string): Promise<Penawaran[]> {
    return penawaranRepository.getByTiketId(idTiket);
  },

  async getByAktivitasId(idAktivitas: string): Promise<Penawaran[]> {
    return penawaranRepository.getByAktivitasId(idAktivitas);
  },
};
