import { squadRepository } from "./squad.repository.ts";
import type { Squad, CreateSquadInput, UpdateSquadInput } from "./squad.types.ts";

export const squadService = {
    async create(data: CreateSquadInput): Promise<Squad> {
        return squadRepository.create(data);
    },

    async getAll(): Promise<Squad[]> {
        return squadRepository.getAll();
    },

    async getById(id: string): Promise<Squad | null> {
        return squadRepository.getById(id);
    },

    async getBySupervisorId(idSupervisor: string): Promise<Squad[]> {
        return squadRepository.getBySupervisorId(idSupervisor);
    },

    async update(id: string, data: UpdateSquadInput): Promise<Squad | null> {
        return squadRepository.update(id, data);
    },

    async delete(id: string): Promise<Squad | null> {
        return squadRepository.delete(id);
    },
};