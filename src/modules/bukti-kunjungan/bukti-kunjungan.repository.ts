import type { BuktiKunjungan } from "./bukti-kunjungan.types.ts";

const buktiKunjunganList: BuktiKunjungan[] = [];

export const buktiKunjunganRepository = {
  async create(data: BuktiKunjungan): Promise<BuktiKunjungan> {
    buktiKunjunganList.push(data);
    return data;
  },

  async getAll(): Promise<BuktiKunjungan[]> {
    return buktiKunjunganList;
  },

  async getById(id: string): Promise<BuktiKunjungan | undefined> {
    return buktiKunjunganList.find((item) => item.id_bukti === id);
  },

  async getByAktivitasId(idAktivitas: string): Promise<BuktiKunjungan[]> {
    return buktiKunjunganList.filter((item) => item.id_aktivitas === idAktivitas);
  },
};
