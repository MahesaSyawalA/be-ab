import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import type { CreateEvidenceData, Evidence, EvidenceFilters, UpdateEvidenceData } from "./evidence.types.ts";

export const evidenceRepository = {
    async create(data: CreateEvidenceData): Promise<Evidence> {
        return prisma.evidence.create({ data });
    },

    async getAll(
        { id_aktivitas, tipe, search }: EvidenceFilters,
        pagination: PaginationParams,
    ): Promise<{ items: Evidence[]; total: number }> {
        const where: Prisma.EvidenceWhereInput = {
            id_aktivitas,
            tipe,
            ...(search && { deskripsi: { contains: search } }),
        };

        const [items, total] = await prisma.$transaction([
            prisma.evidence.findMany({
                where,
                orderBy: [{ waktu_upload: pagination.order }, { id: "asc" }],
                ...toSkipTake(pagination),
            }),
            prisma.evidence.count({ where }),
        ]);

        return { items, total };
    },

    async getById(id: string): Promise<Evidence | null> {
        return prisma.evidence.findUnique({ where: { id } });
    },

    async getByAktivitasId(idAktivitas: string): Promise<Evidence[]> {
        return prisma.evidence.findMany({
            where: { id_aktivitas: idAktivitas },
            orderBy: { waktu_upload: "desc" },
        });
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