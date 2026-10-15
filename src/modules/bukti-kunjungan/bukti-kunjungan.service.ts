import { randomUUID } from "node:crypto";
import { buktiKunjunganRepository } from "./bukti-kunjungan.repository.ts";
import type {
  BuktiKunjungan,
  CreateBuktiKunjunganInput,
} from "./bukti-kunjungan.types.ts";

export const buktiKunjunganService = {
  async create(data: CreateBuktiKunjunganInput): Promise<BuktiKunjungan> {
    const now_timestamptz = new Date().toISOString();

    const bukti: BuktiKunjungan = {
      id_bukti: randomUUID(),
      id_aktivitas: data.id_aktivitas,
      longitude: data.longitude,
      latitude: data.latitude,
      jarak_klien: data.jarak_klien,
      dalam_radius: data.dalam_radius,
      img_url: data.img_url,
      created_at: now_timestamptz,
      updated_at: now_timestamptz,
    };

    return buktiKunjunganRepository.create(bukti);
  },

  async getAll(): Promise<BuktiKunjungan[]> {
    return buktiKunjunganRepository.getAll();
  },

  async getById(id: string): Promise<BuktiKunjungan | undefined> {
    return buktiKunjunganRepository.getById(id);
  },

  async getByAktivitasId(idAktivitas: string): Promise<BuktiKunjungan[]> {
    return buktiKunjunganRepository.getByAktivitasId(idAktivitas);
  },
};
