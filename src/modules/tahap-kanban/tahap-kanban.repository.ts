import type { TahapKanban } from "./tahap-kanban.types.ts";

const tahapList: TahapKanban[] = [];

export const tahapKanbanRepository = {
  async create(data: TahapKanban): Promise<TahapKanban> {
    tahapList.push(data);
    return data;
  },

  async getAll(): Promise<TahapKanban[]> {
    return tahapList.slice().sort((a, b) => a.urutan - b.urutan);
  },

  async getById(id: string): Promise<TahapKanban | undefined> {
    return tahapList.find((item) => item.id_tahap === id);
  },
};
