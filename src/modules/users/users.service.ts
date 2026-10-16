import { userRepository } from "./users.repository.ts";
import type { User, CreateUserInput, UpdateUserInput } from "./users.types.ts";

export const userService = {
    async create(data: CreateUserInput): Promise<User> {
        return userRepository.create(data);
    },

    async getAll(): Promise<User[]> {
        return userRepository.getAll();
    },

    async getById(id: string): Promise<User | null> {
        return userRepository.getById(id);
    },

    async getBySquadId(idSquad: string): Promise<User[]> {
        return userRepository.getBySquadId(idSquad);
    },

    async update(id: string, data: UpdateUserInput): Promise<User | null> {
        return userRepository.update(id, data);
    },

    async delete(id: string): Promise<User | null> {
        return userRepository.delete(id);
    },
};