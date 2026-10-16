import { riwayatTahapRepository } from "./riwayat-tahap.repository.ts";
import type {
  RiwayatTahap,
  CreateRiwayatTahapInput,
  UpdateRiwayatTahapInput,
} from "./riwayat-tahap.types.ts";

export const riwayatTahapService = {
  async create(data: CreateRiwayatTahapInput): Promise<RiwayatTahap> {
    return riwayatTahapRepository.create(data);
  },

  async getAll(): Promise<RiwayatTahap[]> {
    return riwayatTahapRepository.getAll();
  },

  async getById(id: string): Promise<RiwayatTahap | null> {
    return riwayatTahapRepository.getById(id);
  },

  async getByTiketId(idTiket: string): Promise<RiwayatTahap[]> {
    return riwayatTahapRepository.getByTiketId(idTiket);
  },

  async update(id: string, data: UpdateRiwayatTahapInput): Promise<RiwayatTahap | null> {
    return riwayatTahapRepository.update(id, data);
  },

  async delete(id: string): Promise<RiwayatTahap | null> {
    return riwayatTahapRepository.delete(id);
  },
};
