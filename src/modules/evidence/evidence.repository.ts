import { prisma } from "../../config/prisma.ts";
import type { CreateEvidenceData, Evidence, EvidenceFilters, UpdateEvidenceData } from "./evidence.types.ts";

export const evidenceRepository = {
    async create(data: CreateEvidenceData): Promise<Evidence> {
        return prisma.evidence.create({ data });
    },

    async getAll({ id_aktivitas, tipe }: EvidenceFilters = {}): Promise<Evidence[]> {
        return prisma.evidence.findMany({
            where: { id_aktivitas, tipe },
            orderBy: { waktu_upload: "desc" },
        });
    },

    async getById(id: string): Promise<Evidence | null> {
        return prisma.evidence.findUnique({ where: { id } });
    },

    async getByAktivitasId(idAktivitas: string): Promise<Evidence[]> {
        return this.getAll({ id_aktivitas: idAktivitas });
    },

    async update(id: string, data: UpdateEvidenceData): Promise<Evidence | null> {
        const existing = await prisma.evidence.findUnique({ where: { id } });
        if (!existing) return null;

        return prisma.evidence.update({ where: { id }, data });
    },

    async delete(id: string): Promise<boolean> {
        const existing = await prisma.evidence.findUnique({ where: { id } });
        if (!existing) return false;

        await prisma.evidence.delete({ where: { id } });
        return true;
    },
};