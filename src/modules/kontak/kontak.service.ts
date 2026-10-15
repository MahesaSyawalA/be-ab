import { randomUUID } from "node:crypto";
import { kontakRepository } from "./kontak.repository.ts";
import type { Kontak, CreateKontakInput } from "./kontak.types.ts";

export const kontakService = {
  async create(data: CreateKontakInput): Promise<Kontak> {
    const now_timestamptz = new Date().toISOString();

    const kontak: Kontak = {
      id_kontak: randomUUID(),
      id_pelanggan: data.id_pelanggan,
      nama: data.nama,
      jabatan: data.jabatan,
      no_telp: data.no_telp,
      email: data.email,
      created_at: now_timestamptz,
      updated_at: now_timestamptz,
    };

    return kontakRepository.create(kontak);
  },

  async getAll(): Promise<Kontak[]> {
    return kontakRepository.getAll();
  },

  async getById(id: string): Promise<Kontak | undefined> {
    return kontakRepository.getById(id);
  },

  async getByPelangganId(idPelanggan: string): Promise<Kontak[]> {
    return kontakRepository.getByPelangganId(idPelanggan);
  },
};
