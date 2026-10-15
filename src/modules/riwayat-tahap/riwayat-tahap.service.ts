import { randomUUID } from "node:crypto";
import { riwayatTahapRepository } from "./riwayat-tahap.repository.ts";
import type { RiwayatTahap, CreateRiwayatTahapInput } from "./riwayat-tahap.types.ts";

export const riwayatTahapService = {
  async create(data: CreateRiwayatTahapInput): Promise<RiwayatTahap> {
    const riwayat: RiwayatTahap = {
      id_riwayat: randomUUID(),
      id_tiket: data.id_tiket,
      id_tahap_asal: data.id_tahap_asal ?? null,
      id_tahap_tujuan: data.id_tahap_tujuan,
      id_user: data.id_user,
      waktu_pindah: data.waktu_pindah ?? new Date().toISOString(),
    };

    return riwayatTahapRepository.create(riwayat);
  },

  async getAll(): Promise<RiwayatTahap[]> {
    return riwayatTahapRepository.getAll();
  },

  async getById(id: string): Promise<RiwayatTahap | undefined> {
    return riwayatTahapRepository.getById(id);
  },

  async getByTiketId(idTiket: string): Promise<RiwayatTahap[]> {
    return riwayatTahapRepository.getByTiketId(idTiket);
  },
};
