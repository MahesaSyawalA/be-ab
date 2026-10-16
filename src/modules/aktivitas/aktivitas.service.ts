import { aktivitasRepository } from "./aktivitas.repository.ts";
import type {
  Aktivitas,
  CreateAktivitasInput,
  UpdateAktivitasInput,
} from "./aktivitas.types.ts";

export const aktivitasService = {
  async create(data: CreateAktivitasInput): Promise<Aktivitas> {
    return aktivitasRepository.create(data);
  },

  async getAll(): Promise<Aktivitas[]> {
    return aktivitasRepository.getAll();
  },

  async getById(id: string): Promise<Aktivitas | null> {
    return aktivitasRepository.getById(id);
  },

  async getByUserId(idUser: string): Promise<Aktivitas[]> {
    return aktivitasRepository.getByUserId(idUser);
  },

  async getByTiketId(idTiket: string): Promise<Aktivitas[]> {
    return aktivitasRepository.getByTiketId(idTiket);
  },

  async update(id: string, data: UpdateAktivitasInput): Promise<Aktivitas | null> {
    return aktivitasRepository.update(id, data);
  },

  async delete(id: string): Promise<Aktivitas | null> {
    return aktivitasRepository.delete(id);
  },
};
