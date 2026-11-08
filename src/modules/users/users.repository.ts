import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import type {
    CreateUserRecord,
    PublicUser,
    UpdateUserRecord,
    UserFilters,
    UserSortBy,
} from "./users.types.ts";

function buildOrderBy(
    sortBy: UserSortBy,
    order: PaginationParams["order"],
): Prisma.UserOrderByWithRelationInput[] {
    const primary: Prisma.UserOrderByWithRelationInput =
        sortBy === "nama"
            ? { nama: order }
            : sortBy === "role"
                ? { role: order }
                : { created_at: order };

    return [primary, { id_user: "asc" }];
}

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

    async getAll(
        filters: UserFilters,
        pagination: PaginationParams,
        sortBy: UserSortBy,
    ): Promise<{ items: PublicUser[]; total: number }> {
        const where: Prisma.UserWhereInput = {
            id_squad: filters.id_squad,
            role: filters.role,
            ...(filters.search && {
                OR: [
                    { nama: { contains: filters.search } },
                    { email: { contains: filters.search } },
                    { no_telp: { contains: filters.search } },
                ],
            }),
        };

        const [rows, total] = await prisma.$transaction([
            prisma.user.findMany({
                where,
                orderBy: buildOrderBy(sortBy, pagination.order),
                omit: { password_hash: true },
                ...toSkipTake(pagination),
            }),
            prisma.user.count({ where }),
        ]);

        return { items: rows, total };
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

    async update(
        id: string,
        data: UpdateUserRecord
    ): Promise<PublicUser | null> {
        const existing = await prisma.user.findUnique({
            where: { id_user: id },
        });

        if (!existing) return null;

        return prisma.user.update({
            where: { id_user: id },
            data: {
                id_squad: data.id_squad,
                nama: data.nama,
                role: data.role,
                email: data.email,
                no_telp: data.no_telp,
                ...(data.password_hash === undefined
                    ? {}
                    : { password_hash: data.password_hash }),
            },
            omit: { password_hash: true },
        });
    },

    async delete(id: string): Promise<PublicUser | null> {
        const existing = await prisma.user.findUnique({
            where: { id_user: id },
        });

        if (!existing) return null;

        return prisma.user.delete({
            where: { id_user: id },
            omit: { password_hash: true },
        });
    },
};