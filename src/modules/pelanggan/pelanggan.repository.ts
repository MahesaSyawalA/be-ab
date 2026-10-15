import type { Pelanggan } from "./pelanggan.types.ts";

const pelangganList: Pelanggan[] = [];

export const pelangganRepository = {
  async create(data: Pelanggan): Promise<Pelanggan> {
    pelangganList.push(data);
    return data;
  },

  async getAll(): Promise<Pelanggan[]> {
    return pelangganList;
  },

  async getById(id: string): Promise<Pelanggan | undefined> {
    return pelangganList.find((item) => item.id_pelanggan === id);
  },
};
