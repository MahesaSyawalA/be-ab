import bcrypt from "bcryptjs";
import { BCRYPT_COST } from "../../config/auth.ts";
import { userRepository } from "./users.repository.ts";
import type { CreateUserInput, PublicUser, UpdateUserInput } from "./users.types.ts";

export const userService = {
    async create(data: CreateUserInput): Promise<PublicUser> {
        const { password, ...rest } = data;
        const password_hash = await bcrypt.hash(password, BCRYPT_COST);

        return userRepository.create({ ...rest, password_hash });
    },

    async getAll(): Promise<PublicUser[]> {
        return userRepository.getAll();
    },

    async getById(id: string): Promise<PublicUser | null> {
        return userRepository.getById(id);
    },

    async getBySquadId(idSquad: string): Promise<PublicUser[]> {
        return userRepository.getBySquadId(idSquad);
    },

    async update(id: string, data: UpdateUserInput): Promise<PublicUser | null> {
        const { password, ...rest } = data;
        // Hash hanya bila password dikirim; kalau tidak, password lama dipertahankan.
        const password_hash = password === undefined ? undefined : await bcrypt.hash(password, BCRYPT_COST);

        return userRepository.update(id, { ...rest, password_hash });
    },

    async delete(id: string): Promise<PublicUser | null> {
        return userRepository.delete(id);
    },
};
