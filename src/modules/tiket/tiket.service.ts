import { randomUUID } from "node:crypto";
import { tiketRepository } from "./tiket.repository.ts";
import type { Tiket, CreateTiketInput } from "./tiket.types.ts";

export const tiketService = {
  async create(data: CreateTiketInput): Promise<Tiket> {
    const now_timestamptz = new Date().toISOString();

    const tiket: Tiket = {
      id_tiket: randomUUID(),
      id_pelanggan: data.id_pelanggan,
      id_user: data.id_user,
      id_tahap: data.id_tahap,
      id_kontak: data.id_kontak ?? null,
      judul: data.judul,
      estimasi_nilai: data.estimasi_nilai,
      estimasi_closing: data.estimasi_closing,
      status: data.status,
      kebutuhan_pelanggan: data.kebutuhan_pelanggan,
      prioritas: data.prioritas,
      posisi: data.posisi,
      tanggal_penawaran_awal: data.tanggal_penawaran_awal ?? null,
      tanggal_closing: data.tanggal_closing ?? null,
      alasan_lost: data.alasan_lost ?? null,
      created_at: now_timestamptz,
      updated_at: now_timestamptz,
    };

    return tiketRepository.create(tiket);
  },

  async getAll(): Promise<Tiket[]> {
    return tiketRepository.getAll();
  },

  async getById(id: string): Promise<Tiket | undefined> {
    return tiketRepository.getById(id);
  },

  async getByPelangganId(idPelanggan: string): Promise<Tiket[]> {
    return tiketRepository.getByPelangganId(idPelanggan);
  },

  async getByUserId(idUser: string): Promise<Tiket[]> {
    return tiketRepository.getByUserId(idUser);
  },

  async getByTahapId(idTahap: string): Promise<Tiket[]> {
    return tiketRepository.getByTahapId(idTahap);
  },

  async getByKontakId(idKontak: string): Promise<Tiket[]> {
    return tiketRepository.getByKontakId(idKontak);
  },
};
