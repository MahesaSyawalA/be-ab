import type { RiwayatTahap } from "./riwayat-tahap.types.ts";

const riwayatList: RiwayatTahap[] = [];

export const riwayatTahapRepository = {
  async create(data: RiwayatTahap): Promise<RiwayatTahap> {
    riwayatList.push(data);
    return data;
  },

  async getAll(): Promise<RiwayatTahap[]> {
    return riwayatList;
  },

  async getById(id: string): Promise<RiwayatTahap | undefined> {
    return riwayatList.find((item) => item.id_riwayat === id);
  },

  async getByTiketId(idTiket: string): Promise<RiwayatTahap[]> {
    return riwayatList.filter((item) => item.id_tiket === idTiket);
  },
};
