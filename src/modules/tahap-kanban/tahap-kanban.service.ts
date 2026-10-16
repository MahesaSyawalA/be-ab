import { tahapKanbanRepository } from "./tahap-kanban.repository.ts";
import type {
  TahapKanban,
  CreateTahapKanbanInput,
  UpdateTahapKanbanInput,
} from "./tahap-kanban.types.ts";

export const tahapKanbanService = {
  async create(data: CreateTahapKanbanInput): Promise<TahapKanban> {
    return tahapKanbanRepository.create(data);
  },

  async getAll(): Promise<TahapKanban[]> {
    return tahapKanbanRepository.getAll();
  },

  async getById(id: string): Promise<TahapKanban | null> {
    return tahapKanbanRepository.getById(id);
  },

  async update(id: string, data: UpdateTahapKanbanInput): Promise<TahapKanban | null> {
    return tahapKanbanRepository.update(id, data);
  },

  async delete(id: string): Promise<TahapKanban | null> {
    return tahapKanbanRepository.delete(id);
  },
};
