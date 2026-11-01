import { pelangganRepository } from "./pelanggan.repository.ts";
import type {
  Pelanggan,
  PelangganWithDetails,
  CreatePelangganInput,
  UpdatePelangganInput,
} from "./pelanggan.types.ts";

export const pelangganService = {
  async create(data: CreatePelangganInput): Promise<PelangganWithDetails> {
    return pelangganRepository.create(data);
  },

  async getAll(): Promise<PelangganWithDetails[]> {
    return pelangganRepository.getAll();
  },

  async getById(id: string): Promise<PelangganWithDetails | null> {
    return pelangganRepository.getById(id);
  },

  async update(id: string, data: UpdatePelangganInput): Promise<Pelanggan | null> {
    return pelangganRepository.update(id, data);
  },

  async delete(id: string): Promise<Pelanggan | null> {
    return pelangganRepository.delete(id);
  },
};
