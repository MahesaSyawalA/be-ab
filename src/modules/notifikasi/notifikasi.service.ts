import { buildMeta } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { notifikasiRepository } from "./notifikasi.repository.ts";
import type {
  Notifikasi,
  NotifikasiFilters,
  CreateNotifikasiInput,
  UpdateNotifikasiInput,
} from "./notifikasi.types.ts";

export const notifikasiService = {
  async create(data: CreateNotifikasiInput): Promise<Notifikasi> {
    return notifikasiRepository.create(data);
  },

  async getAll(filters: NotifikasiFilters, pagination: PaginationParams) {
    const { items, total } = await notifikasiRepository.getAll(filters, pagination);
    return { data: items, meta: buildMeta(total, pagination) };
  },

  async getById(id: string, idUser: string): Promise<Notifikasi | null> {
    return notifikasiRepository.getById(id, idUser);
  },

  async countUnread(idUser: string): Promise<number> {
    return notifikasiRepository.countUnread(idUser);
  },

  async markAllAsRead(idUser: string): Promise<number> {
    return notifikasiRepository.markAllAsRead(idUser);
  },

  async getByTiketId(idTiket: string): Promise<Notifikasi[]> {
    return notifikasiRepository.getByTiketId(idTiket);
  },

  async markAsRead(id: string, idUser: string): Promise<Notifikasi | null> {
    return notifikasiRepository.markAsRead(id, idUser);
  },

  async update(id: string, idUser: string, data: UpdateNotifikasiInput): Promise<Notifikasi | null> {
    return notifikasiRepository.update(id, idUser, data);
  },

  async delete(id: string, idUser: string): Promise<Notifikasi | null> {
    return notifikasiRepository.delete(id, idUser);
  },
};