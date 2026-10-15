import type { Kontak } from "./kontak.types.ts";

const kontakList: Kontak[] = [];

export const kontakRepository = {
  async create(data: Kontak): Promise<Kontak> {
    kontakList.push(data);
    return data;
  },

  async getAll(): Promise<Kontak[]> {
    return kontakList;
  },

  async getById(id: string): Promise<Kontak | undefined> {
    return kontakList.find((item) => item.id_kontak === id);
  },

  async getByPelangganId(idPelanggan: string): Promise<Kontak[]> {
    return kontakList.filter((item) => item.id_pelanggan === idPelanggan);
  },
};
