import { tiketRepository } from "./tiket.repository.ts";
import type {
  Tiket,
  TiketWithDetails,
  CreateTiketInput,
  UpdateTiketInput,
} from "./tiket.types.ts";

export const tiketService = {
  async create(data: CreateTiketInput): Promise<TiketWithDetails> {
    return tiketRepository.create(data);
  },

  async getAll(): Promise<TiketWithDetails[]> {
    return tiketRepository.getAll();
  },

  async getById(id: string): Promise<TiketWithDetails | null> {
    return tiketRepository.getById(id);
  },

  async getByPelangganId(idPelanggan: string): Promise<TiketWithDetails[]> {
    return tiketRepository.getByPelangganId(idPelanggan);
  },

  async getByUserId(idUser: string): Promise<TiketWithDetails[]> {
    return tiketRepository.getByUserId(idUser);
  },

  async getByTahapId(idTahap: string): Promise<TiketWithDetails[]> {
    return tiketRepository.getByTahapId(idTahap);
  },

  async getByKontakId(idKontak: string): Promise<TiketWithDetails[]> {
    return tiketRepository.getByKontakId(idKontak);
  },

  async update(id: string, data: UpdateTiketInput): Promise<TiketWithDetails | null> {
    return tiketRepository.update(id, data);
  },

  async delete(id: string): Promise<Tiket | null> {
    return tiketRepository.delete(id);
  },
};
