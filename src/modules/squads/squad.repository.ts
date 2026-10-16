import { prisma } from "../../config/prisma.ts";
import type { Squad, CreateSquadInput, UpdateSquadInput } from "./squad.types.ts";

export const squadRepository = {
    async create(data: CreateSquadInput): Promise<Squad> {
        return prisma.squad.create({
            data: {
                id_supervisor: data.id_supervisor ?? null,
                nama_squad: data.nama_squad,
                kode_squad: data.kode_squad,
                wilayah: data.wilayah,
                is_active: data.is_active,
            },
        });
    },

    async getAll(): Promise<Squad[]> {
        return prisma.squad.findMany({
            orderBy: { created_at: "desc" },
        });
    },

    async getById(id: string): Promise<Squad | null> {
        return prisma.squad.findUnique({
            where: { id_squad: id },
        });
    },

    async getBySupervisorId(idSupervisor: string): Promise<Squad[]> {
        return prisma.squad.findMany({
            where: { id_supervisor: idSupervisor },
        });
    },

    async update(id: string, data: UpdateSquadInput): Promise<Squad | null> {
        const existing = await prisma.squad.findUnique({ where: { id_squad: id } });
        if (!existing) return null;

        return prisma.squad.update({
            where: { id_squad: id },
            data,
        });
    },

    async delete(id: string): Promise<Squad | null> {
        const existing = await prisma.squad.findUnique({ where: { id_squad: id } });
        if (!existing) return null;

        return prisma.squad.delete({
            where: { id_squad: id },
        });
    },
};