import { randomUUID } from "node:crypto";
import { userRepository } from "./users.repository.ts";
import type { User, CreateUserInput } from "./users.types.ts";

export const userService = {
    async create(data: CreateUserInput): Promise<User> {
        
        const now_timestamptz = new Date().toISOString();
        
        const user: User = {
            id_user: randomUUID(),
            id_squad: randomUUID(),
            nama: data.nama,
            role: data.role,
            email: data.email,
            no_telp: data.no_telp,
            password_hash: data.password_hash,
            created_at: now_timestamptz,
            updated_at: now_timestamptz,
        }
        return userRepository.create(user);
    },

    async getAll(): Promise<User[]> {
        return userRepository.getAll();
    }
}