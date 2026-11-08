import { buildMeta } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { aktivitasRepository } from "./aktivitas.repository.ts";
import type {
  Aktivitas,
  AktivitasFilters,
  CreateAktivitasInput,
  UpdateAktivitasInput,
} from "./aktivitas.types.ts";

export const aktivitasService = {
  async create(data: CreateAktivitasInput): Promise<Aktivitas> {
    return aktivitasRepository.create(data);
  },

  async getAll(filters: AktivitasFilters, pagination: PaginationParams) {
    const { items, total } = await aktivitasRepository.getAll(filters, pagination);
    return { data: items, meta: buildMeta(total, pagination) };
  },

  async getById(id: string) {
    return aktivitasRepository.getById(id);
  },

  async getByUserId(idUser: string): Promise<Aktivitas[]> {
    return aktivitasRepository.getByUserId(idUser);
  },

  async getByTiketId(idTiket: string) {
    return aktivitasRepository.getByTiketId(idTiket);
  },

  async update(
    id: string,
    data: UpdateAktivitasInput,
  ): Promise<Aktivitas | null> {
    return aktivitasRepository.update(id, data);
  },

  async delete(id: string): Promise<Aktivitas | null> {
    return aktivitasRepository.delete(id);
  },
};