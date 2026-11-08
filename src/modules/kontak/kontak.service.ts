import { buildMeta } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { kontakRepository } from "./kontak.repository.ts";
import type { Kontak, KontakFilters, CreateKontakInput, UpdateKontakInput } from "./kontak.types.ts";

export const kontakService = {
  async create(data: CreateKontakInput): Promise<Kontak> {
    return kontakRepository.create(data);
  },

  async getAll(filters: KontakFilters, pagination: PaginationParams) {
    const { items, total } = await kontakRepository.getAll(filters, pagination);
    return { data: items, meta: buildMeta(total, pagination) };
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