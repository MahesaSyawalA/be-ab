import type { Squad } from "./squad.types.ts";

const squads: Squad[] = [];

export const squadRepository = {
    async create(data: Squad): Promise<Squad> {
        squads.push(data);
        return data;
    },

    async getAll(): Promise<Squad[]> {
        return squads;
    },

    async getById(id: string): Promise<Squad | undefined> {
        return squads.find((squad) => squad.id_squad == id)
    }
}