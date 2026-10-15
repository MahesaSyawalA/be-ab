import type { User } from "./users.types.ts";

const users: User[] = [];

export const userRepository = {
    async create(data: User): Promise<User> {
        users.push(data);
        return data;
    },
    
    async getAll(): Promise<User[]> {
        return users;
    },

    async getById(id: string): Promise<User | undefined> {
        return users.find((user) => user.id_user === id);
    },

    async getBySquadId(idSquad: string): Promise<User[]> {
        return users.filter((user) => user.id_squad === idSquad);
    }
}