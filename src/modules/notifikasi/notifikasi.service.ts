import { notifikasiRepository } from "./notifikasi.repository.ts";
import type {
  Notifikasi,
  CreateNotifikasiInput,
  UpdateNotifikasiInput,
} from "./notifikasi.types.ts";

export const notifikasiService = {
  async create(data: CreateNotifikasiInput): Promise<Notifikasi> {
    return notifikasiRepository.create(data);
  },

  async getAll(): Promise<Notifikasi[]> {
    return notifikasiRepository.getAll();
  },

  async getById(id: string): Promise<Notifikasi | null> {
    return notifikasiRepository.getById(id);
  },

  async getByTiketId(idTiket: string): Promise<Notifikasi[]> {
    return notifikasiRepository.getByTiketId(idTiket);
  },

  async markAsRead(id: string): Promise<Notifikasi | null> {
    return notifikasiRepository.markAsRead(id);
  },

  async update(id: string, data: UpdateNotifikasiInput): Promise<Notifikasi | null> {
    return notifikasiRepository.update(id, data);
  },

  async delete(id: string): Promise<Notifikasi | null> {
    return notifikasiRepository.delete(id);
  },
};
