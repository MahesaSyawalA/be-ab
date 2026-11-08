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