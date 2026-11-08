import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import type { CreateSquadInput, SquadFilters, SquadWithDetails, UpdateSquadInput } from "./squad.types.ts";

const memberSelect = { id_user: true, nama: true, role: true, email: true, no_telp: true } as const;
const detailInclude = {
    supervisor: { select: memberSelect },
    members: { select: memberSelect, orderBy: { nama: "asc" } },
} satisfies Prisma.SquadInclude;

type SquadRow = Prisma.SquadGetPayload<{ include: typeof detailInclude }>;

const toConnect = (ids: string[]) => ids.map((id_user) => ({ id_user }));

/** Tambahkan `member_count` dan `progress_persen` (tiket `won` / semua tiket anggota). */
async function withProgress(squads: SquadRow[]): Promise<SquadWithDetails[]> {
    const memberIds = squads.flatMap((s) => s.members.map((m) => m.id_user));
    const grouped = memberIds.length
        ? await prisma.tiket.groupBy({
              by: ["id_user", "status"],
              where: { id_user: { in: memberIds } },
              _count: { _all: true },
          })
        : [];

    return squads.map((squad) => {
        const ids = new Set(squad.members.map((m) => m.id_user));
        let total = 0;
        let won = 0;
        for (const row of grouped) {
            if (!ids.has(row.id_user)) continue;
            total += row._count._all;
            if (row.status === "won") won += row._count._all;
        }

        return {
            ...squad,
            member_count: squad.members.length,
            progress_persen: total ? Math.round((won / total) * 100) : 0,
        };
    });
}

export const squadRepository = {
    async create({ member_ids, ...data }: CreateSquadInput): Promise<SquadWithDetails> {
        const squad = await prisma.squad.create({
            data: {
                ...data,
                id_supervisor: data.id_supervisor ?? null,
                members: member_ids ? { connect: toConnect(member_ids) } : undefined,
            },
            include: detailInclude,
        });
        return (await withProgress([squad]))[0];
    },

    async getAll(
        filters: SquadFilters,
        pagination: PaginationParams,
    ): Promise<{ items: SquadWithDetails[]; total: number }> {
        const where: Prisma.SquadWhereInput = {
            id_supervisor: filters.id_supervisor,
            is_active: filters.is_active,
            wilayah: filters.wilayah,
            ...(filters.search && {
                OR: [
                    { nama_squad: { contains: filters.search } },
                    { kode_squad: { contains: filters.search } },
                ],
            }),
        };

        const [squads, total] = await prisma.$transaction([
            prisma.squad.findMany({
                where,
                include: detailInclude,
                orderBy: [{ created_at: pagination.order }, { id_squad: "asc" }],
                ...toSkipTake(pagination),
            }),
            prisma.squad.count({ where }),
        ]);

        return { items: await withProgress(squads), total };
    },

    async getById(id: string): Promise<SquadWithDetails | null> {
        const squad = await prisma.squad.findUnique({
            where: { id_squad: id },
            include: detailInclude,
        });
        return squad ? (await withProgress([squad]))[0] : null;
    },

    async getBySupervisorId(idSupervisor: string): Promise<SquadWithDetails[]> {
        const squads = await prisma.squad.findMany({
            where: { id_supervisor: idSupervisor },
            orderBy: { created_at: "desc" },
            include: detailInclude,
        });
        return withProgress(squads);
    },

    async update(id: string, { member_ids, ...data }: UpdateSquadInput): Promise<SquadWithDetails | null> {
        const existing = await prisma.squad.findUnique({ where: { id_squad: id } });
        if (!existing) return null;

        const squad = await prisma.squad.update({
            where: { id_squad: id },
            data: {
                ...data,
                members: member_ids ? { set: toConnect(member_ids) } : undefined,
            },
            include: detailInclude,
        });
        return (await withProgress([squad]))[0];
    },

    async delete(id: string): Promise<boolean> {
        const existing = await prisma.squad.findUnique({ where: { id_squad: id } });
        if (!existing) return false;

        await prisma.squad.delete({ where: { id_squad: id } });
        return true;
    },
};