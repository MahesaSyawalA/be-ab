import type { Aktivitas } from "./aktivitas.types.ts";

const aktivitasList: Aktivitas[] = [];

export const aktivitasRepository = {
  async create(data: Aktivitas): Promise<Aktivitas> {
    aktivitasList.push(data);
    return data;
  },

  async getAll(): Promise<Aktivitas[]> {
    return aktivitasList;
  },

  async getById(id: string): Promise<Aktivitas | undefined> {
    return aktivitasList.find((item) => item.id_aktivitas === id);
  },

  async getByUserId(idUser: string): Promise<Aktivitas[]> {
    return aktivitasList.filter((item) => item.id_user === idUser);
  },

  async getByTiketId(idTiket: string): Promise<Aktivitas[]> {
    return aktivitasList.filter((item) => item.id_tiket === idTiket);
  },
};
