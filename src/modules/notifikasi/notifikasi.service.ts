import { randomUUID } from "node:crypto";
import { notifikasiRepository } from "./notifikasi.repository.ts";
import type {
  Notifikasi,
  CreateNotifikasiInput,
} from "./notifikasi.types.ts";

export const notifikasiService = {
  async create(data: CreateNotifikasiInput): Promise<Notifikasi> {
    const now_timestamptz = new Date().toISOString();

    const notif: Notifikasi = {
      id_notifikasi: randomUUID(),
      id_tiket: data.id_tiket,
      title: data.title,
      isRead: data.isRead ?? false,
      message: data.message,
      created_at: now_timestamptz,
      updated_at: now_timestamptz,
    };

    return notifikasiRepository.create(notif);
  },

  async getAll(): Promise<Notifikasi[]> {
    return notifikasiRepository.getAll();
  },

  async getById(id: string): Promise<Notifikasi | undefined> {
    return notifikasiRepository.getById(id);
  },

  async getByTiketId(idTiket: string): Promise<Notifikasi[]> {
    return notifikasiRepository.getByTiketId(idTiket);
  },

  async markAsRead(id: string): Promise<Notifikasi | undefined> {
    return notifikasiRepository.markAsRead(id);
  },
};
