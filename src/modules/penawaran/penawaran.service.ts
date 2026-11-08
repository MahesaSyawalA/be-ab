import { buildMeta } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { penawaranRepository } from "./penawaran.repository.ts";
import type {
  Penawaran,
  PenawaranFilters,
  CreatePenawaranInput,
  UpdatePenawaranInput,
} from "./penawaran.types.ts";

export const penawaranService = {
  async create(data: CreatePenawaranInput): Promise<Penawaran> {
    const existing = await penawaranRepository.getByNoPenawaran(data.no_penawaran);
    if (existing) {
      throw new Error(`Nomor penawaran '${data.no_penawaran}' already exists.`);
    }

    return penawaranRepository.create(data);
  },

  async getAll(filters: PenawaranFilters, pagination: PaginationParams) {
    const { items, total } = await penawaranRepository.getAll(filters, pagination);
    return { data: items, meta: buildMeta(total, pagination) };
  },

  async getById(id: string): Promise<Penawaran | null> {
    return penawaranRepository.getById(id);
  },

  async getByNoPenawaran(noPenawaran: string): Promise<Penawaran | null> {
    return penawaranRepository.getByNoPenawaran(noPenawaran);
  },

  async getByTiketId(idTiket: string): Promise<Penawaran[]> {
    return penawaranRepository.getByTiketId(idTiket);
  },

  async getByAktivitasId(idAktivitas: string): Promise<Penawaran[]> {
    return penawaranRepository.getByAktivitasId(idAktivitas);
  },

  async update(id: string, data: UpdatePenawaranInput): Promise<Penawaran | null> {
    if (data.no_penawaran) {
      const existing = await penawaranRepository.getByNoPenawaran(data.no_penawaran);
      if (existing && existing.id_penawaran !== id) {
        throw new Error(`Nomor penawaran '${data.no_penawaran}' already exists.`);
      }
    }
    return penawaranRepository.update(id, data);
  },

  async delete(id: string): Promise<Penawaran | null> {
    return penawaranRepository.delete(id);
  },
};