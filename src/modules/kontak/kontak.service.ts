import { kontakRepository } from "./kontak.repository.ts";
import type { Kontak, CreateKontakInput, UpdateKontakInput } from "./kontak.types.ts";

export const kontakService = {
  async create(data: CreateKontakInput): Promise<Kontak> {
    return kontakRepository.create(data);
  },

  async getAll(): Promise<Kontak[]> {
    return kontakRepository.getAll();
  },

  async getById(id: string): Promise<Kontak | null> {
    return kontakRepository.getById(id);
  },

  async getByPelangganId(idPelanggan: string): Promise<Kontak[]> {
    return kontakRepository.getByPelangganId(idPelanggan);
  },

  async update(id: string, data: UpdateKontakInput): Promise<Kontak | null> {
    return kontakRepository.update(id, data);
  },

  async delete(id: string): Promise<Kontak | null> {
    return kontakRepository.delete(id);
  },
};
