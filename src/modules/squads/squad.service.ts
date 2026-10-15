import { randomUUID } from "node:crypto";
import { squadRepository } from "./squad.repository.ts";
import type { Squad, CreateSquadInput } from "./squad.types.ts";

export const squadService = {
    async create(data: CreateSquadInput): Promise<Squad> {
        const now_timestamptz = new Date().toISOString();

        const squad: Squad = {
            id_squad: randomUUID(),
            id_supervisor: data.id_supervisor ?? null,
            nama_squad: data.nama_squad,
            kode_squad: data.kode_squad,
            wilayah: data.wilayah,
            is_active: data.is_active,
            created_at: now_timestamptz,
            updated_at: now_timestamptz
        }

        return squadRepository.create(squad);
    },
    
    async getAll(): Promise<Squad[]> {
        return squadRepository.getAll();
    },

    async getById(id: string): Promise<Squad | undefined> {
        return squadRepository.getById(id);
    },

    async getBySupervisorId(idSupervisor: string): Promise<Squad[]> {
        return squadRepository.getBySupervisorId(idSupervisor);
    }
}