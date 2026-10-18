import { prisma } from "../../config/prisma.ts";
import type { CreateUserRecord, PublicUser, UpdateUserRecord } from "./users.types.ts";

/**
 * `password_hash` di-omit pada seluruh query di modul ini sehingga tidak pernah
 * ikut ter-serialize ke response. `auth.repository.ts` sengaja tidak meng-omit
 * karena memang butuh hash untuk verifikasi login.
 */
export const userRepository = {
    async create(data: CreateUserRecord): Promise<PublicUser> {
        return prisma.user.create({
            data: {
                id_squad: data.id_squad ?? null,
                nama: data.nama,
                role: data.role,
                email: data.email,
                no_telp: data.no_telp,
                password_hash: data.password_hash,
            },
            omit: { password_hash: true },
        });
    },

    async getAll(): Promise<PublicUser[]> {
        return prisma.user.findMany({
            orderBy: { created_at: "desc" },
            omit: { password_hash: true },
        });
    },

    async getById(id: string): Promise<PublicUser | null> {
        return prisma.user.findUnique({
            where: { id_user: id },
            omit: { password_hash: true },
        });
    },

    async getBySquadId(idSquad: string): Promise<PublicUser[]> {
        return prisma.user.findMany({
            where: { id_squad: idSquad },
            omit: { password_hash: true },
        });
    },

    async update(id: string, data: UpdateUserRecord): Promise<PublicUser | null> {
        const existing = await prisma.user.findUnique({ where: { id_user: id } });
        if (!existing) return null;

        return prisma.user.update({
            where: { id_user: id },
            data: {
                id_squad: data.id_squad,
                nama: data.nama,
                role: data.role,
                email: data.email,
                no_telp: data.no_telp,
                ...(data.password_hash === undefined ? {} : { password_hash: data.password_hash }),
            },
            omit: { password_hash: true },
        });
    },

    async delete(id: string): Promise<PublicUser | null> {
        const existing = await prisma.user.findUnique({ where: { id_user: id } });
        if (!existing) return null;

        return prisma.user.delete({
            where: { id_user: id },
            omit: { password_hash: true },
        });
    },
};
