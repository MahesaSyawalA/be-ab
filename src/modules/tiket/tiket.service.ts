import { tiketRepository } from "./tiket.repository.ts";
import type { Tiket, CreateTiketInput, UpdateTiketInput } from "./tiket.types.ts";

export const tiketService = {
  async create(data: CreateTiketInput): Promise<Tiket> {
    return tiketRepository.create(data);
  },

  async getAll(): Promise<Tiket[]> {
    return tiketRepository.getAll();
  },

  async getById(id: string): Promise<Tiket | null> {
    return tiketRepository.getById(id);
  },

  async getByPelangganId(idPelanggan: string): Promise<Tiket[]> {
    return tiketRepository.getByPelangganId(idPelanggan);
  },

  async getByUserId(idUser: string): Promise<Tiket[]> {
    return tiketRepository.getByUserId(idUser);
  },

  async getByTahapId(idTahap: string): Promise<Tiket[]> {
    return tiketRepository.getByTahapId(idTahap);
  },

  async getByKontakId(idKontak: string): Promise<Tiket[]> {
    return tiketRepository.getByKontakId(idKontak);
  },

  async update(id: string, data: UpdateTiketInput): Promise<Tiket | null> {
    return tiketRepository.update(id, data);
  },

  async delete(id: string): Promise<Tiket | null> {
    return tiketRepository.delete(id);
  },
};
