import { buildMeta } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { buktiKunjunganRepository } from "./bukti-kunjungan.repository.ts";
import type {
  BuktiKunjungan,
  BuktiKunjunganFilters,
  CreateBuktiKunjunganInput,
  UpdateBuktiKunjunganInput,
} from "./bukti-kunjungan.types.ts";

export const buktiKunjunganService = {
  async create(data: CreateBuktiKunjunganInput): Promise<BuktiKunjungan> {
    return buktiKunjunganRepository.create(data);
  },

  async getAll(filters: BuktiKunjunganFilters, pagination: PaginationParams) {
    const { items, total } = await buktiKunjunganRepository.getAll(filters, pagination);
    return { data: items, meta: buildMeta(total, pagination) };
  },

  async getById(id: string): Promise<BuktiKunjungan | null> {
    return buktiKunjunganRepository.getById(id);
  },

  async getByAktivitasId(idAktivitas: string): Promise<BuktiKunjungan[]> {
    return buktiKunjunganRepository.getByAktivitasId(idAktivitas);
  },

  async update(id: string, data: UpdateBuktiKunjunganInput): Promise<BuktiKunjungan | null> {
    return buktiKunjunganRepository.update(id, data);
  },

  async delete(id: string): Promise<BuktiKunjungan | null> {
    return buktiKunjunganRepository.delete(id);
  },
};