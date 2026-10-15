import type { Tiket } from "./tiket.types.ts";

const tiketList: Tiket[] = [];

export const tiketRepository = {
  async create(data: Tiket): Promise<Tiket> {
    tiketList.push(data);
    return data;
  },

  async getAll(): Promise<Tiket[]> {
    return tiketList;
  },

  async getById(id: string): Promise<Tiket | undefined> {
    return tiketList.find((item) => item.id_tiket === id);
  },

  async getByPelangganId(idPelanggan: string): Promise<Tiket[]> {
    return tiketList.filter((item) => item.id_pelanggan === idPelanggan);
  },

  async getByUserId(idUser: string): Promise<Tiket[]> {
    return tiketList.filter((item) => item.id_user === idUser);
  },

  async getByTahapId(idTahap: string): Promise<Tiket[]> {
    return tiketList.filter((item) => item.id_tahap === idTahap);
  },

  async getByKontakId(idKontak: string): Promise<Tiket[]> {
    return tiketList.filter((item) => item.id_kontak === idKontak);
  },
};
