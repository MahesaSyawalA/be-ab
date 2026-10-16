import { prisma } from "../../config/prisma.ts";
import type { User, CreateUserInput, UpdateUserInput } from "./users.types.ts";

export const userRepository = {
    async create(data: CreateUserInput): Promise<User> {
        return prisma.user.create({
            data: {
                id_squad: data.id_squad ?? null,
                nama: data.nama,
                role: data.role,
                email: data.email,
                no_telp: data.no_telp,
                password_hash: data.password_hash,
            },
        });
    },
    
    async getAll(): Promise<User[]> {
        return prisma.user.findMany({
            orderBy: { created_at: "desc" },
        });
    },

    async getById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id_user: id },
        });
    },

    async getBySquadId(idSquad: string): Promise<User[]> {
        return prisma.user.findMany({
            where: { id_squad: idSquad },
        });
    },

    async update(id: string, data: UpdateUserInput): Promise<User | null> {
        const existing = await prisma.user.findUnique({ where: { id_user: id } });
        if (!existing) return null;

        return prisma.user.update({
            where: { id_user: id },
            data,
        });
    },

    async delete(id: string): Promise<User | null> {
        const existing = await prisma.user.findUnique({ where: { id_user: id } });
        if (!existing) return null;

        return prisma.user.delete({
            where: { id_user: id },
        });
    },
};