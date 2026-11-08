import { buildMeta } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { riwayatTahapRepository } from "./riwayat-tahap.repository.ts";
import type {
  RiwayatTahap,
  RiwayatTahapFilters,
  CreateRiwayatTahapInput,
  UpdateRiwayatTahapInput,
} from "./riwayat-tahap.types.ts";

export const riwayatTahapService = {
  async create(data: CreateRiwayatTahapInput): Promise<RiwayatTahap> {
    return riwayatTahapRepository.create(data);
  },

  async getAll(filters: RiwayatTahapFilters, pagination: PaginationParams) {
    const { items, total } = await riwayatTahapRepository.getAll(filters, pagination);
    return { data: items, meta: buildMeta(total, pagination) };
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