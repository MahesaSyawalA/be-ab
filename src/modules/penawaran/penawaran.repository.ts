import type { Penawaran } from "./penawaran.types.ts";

const penawaranList: Penawaran[] = [];

export const penawaranRepository = {
  async create(data: Penawaran): Promise<Penawaran> {
    penawaranList.push(data);
    return data;
  },

  async getAll(): Promise<Penawaran[]> {
    return penawaranList;
  },

  async getById(id: string): Promise<Penawaran | undefined> {
    return penawaranList.find((item) => item.id_penawaran === id);
  },

  async getByNoPenawaran(noPenawaran: string): Promise<Penawaran | undefined> {
    return penawaranList.find((item) => item.no_penawaran === noPenawaran);
  },

  async getByTiketId(idTiket: string): Promise<Penawaran[]> {
    return penawaranList.filter((item) => item.id_tiket === idTiket);
  },

  async getByAktivitasId(idAktivitas: string): Promise<Penawaran[]> {
    return penawaranList.filter((item) => item.id_aktivitas === idAktivitas);
  },
};
