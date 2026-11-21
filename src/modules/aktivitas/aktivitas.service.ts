import { buildMeta } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { ensurePenawaranForAktivitas } from "../tiket/tiket-stage-effects.ts";
import { aktivitasRepository } from "./aktivitas.repository.ts";
import type {
  Aktivitas,
  AktivitasFilters,
  CreateAktivitasInput,
  UpdateAktivitasInput,
} from "./aktivitas.types.ts";

export const aktivitasService = {
  async create(data: CreateAktivitasInput): Promise<Aktivitas> {
    const created = await aktivitasRepository.create(data);
    if (created.jenis_kegiatan === "quotation") {
      await ensurePenawaranForAktivitas(
        created.id_aktivitas,
        created.id_tiket,
        data.total_nilai,
        data.tanggal,
      );
    }
    return created;
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