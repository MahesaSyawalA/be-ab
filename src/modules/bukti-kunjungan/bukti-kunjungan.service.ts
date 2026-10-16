import { buktiKunjunganRepository } from "./bukti-kunjungan.repository.ts";
import type {
  BuktiKunjungan,
  CreateBuktiKunjunganInput,
  UpdateBuktiKunjunganInput,
} from "./bukti-kunjungan.types.ts";

export const buktiKunjunganService = {
  async create(data: CreateBuktiKunjunganInput): Promise<BuktiKunjungan> {
    return buktiKunjunganRepository.create(data);
  },

  async getAll(): Promise<BuktiKunjungan[]> {
    return buktiKunjunganRepository.getAll();
  },

  async getById(id: string): Promise<BuktiKunjungan | null> {
    return buktiKunjunganRepository.getById(id);
  },

  async getByAktivitasId(idAktivitas: string): Promise<BuktiKunjungan[]> {
    return buktiKunjunganRepository.getByAktivitasId(idAktivitas);
  },

  async update(id: string, data: UpdateBuktiKunjunganInput): Promise<BuktiKunjungan | null> {
    return buktiKunjunganRepository.update(id, data);
  },

  async delete(id: string): Promise<BuktiKunjungan | null> {
    return buktiKunjunganRepository.delete(id);
  },
};
