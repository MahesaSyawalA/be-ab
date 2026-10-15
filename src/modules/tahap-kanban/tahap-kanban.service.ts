import { randomUUID } from "node:crypto";
import { tahapKanbanRepository } from "./tahap-kanban.repository.ts";
import type { TahapKanban, CreateTahapKanbanInput } from "./tahap-kanban.types.ts";

export const tahapKanbanService = {
  async create(data: CreateTahapKanbanInput): Promise<TahapKanban> {
    const tahap: TahapKanban = {
      id_tahap: randomUUID(),
      nama_tahap: data.nama_tahap,
      urutan: data.urutan,
      jenis_tahap: data.jenis_tahap,
      is_tahap_akhir: data.is_tahap_akhir,
      is_aktif: data.is_aktif,
    };

    return tahapKanbanRepository.create(tahap);
  },

  async getAll(): Promise<TahapKanban[]> {
    return tahapKanbanRepository.getAll();
  },

  async getById(id: string): Promise<TahapKanban | undefined> {
    return tahapKanbanRepository.getById(id);
  },
};
