import { randomUUID } from "node:crypto";
import { pelangganRepository } from "./pelanggan.repository.ts";
import type { Pelanggan, CreatePelangganInput } from "./pelanggan.types.ts";

export const pelangganService = {
  async create(data: CreatePelangganInput): Promise<Pelanggan> {
    const now_timestamptz = new Date().toISOString();

    const pelanggan: Pelanggan = {
      id_pelanggan: randomUUID(),
      nama_faskes: data.nama_faskes,
      tipe_faskes: data.tipe_faskes,
      alamat: data.alamat,
      latitude: data.latitude,
      longitude: data.longitude,
      radius_kunjungan: data.radius_kunjungan,
      img_url: data.img_url,
      created_at: now_timestamptz,
      updated_at: now_timestamptz,
    };

    return pelangganRepository.create(pelanggan);
  },

  async getAll(): Promise<Pelanggan[]> {
    return pelangganRepository.getAll();
  },

  async getById(id: string): Promise<Pelanggan | undefined> {
    return pelangganRepository.getById(id);
  },
};
