import { buildMeta } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { tahapKanbanRepository } from "./tahap-kanban.repository.ts";
import type {
  TahapKanban,
  TahapKanbanFilters,
  CreateTahapKanbanInput,
  UpdateTahapKanbanInput,
} from "./tahap-kanban.types.ts";

export const tahapKanbanService = {
  async create(data: CreateTahapKanbanInput): Promise<TahapKanban> {
    return tahapKanbanRepository.create(data);
  },

  async getAll(filters: TahapKanbanFilters, pagination: PaginationParams) {
    const { items, total } = await tahapKanbanRepository.getAll(filters, pagination);
    return { data: items, meta: buildMeta(total, pagination) };
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