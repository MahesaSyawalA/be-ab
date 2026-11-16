import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import type {
    CreateUserRecord,
    PublicUser,
    PublicUserWithSquad,
    UpdateUserRecord,
    UserFilters,
    UserSortBy,
} from "./users.types.ts";

const squadSelect = {
    select: { id_squad: true, nama_squad: true },
} as const;

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
    async create(data: CreateUserRecord): Promise<PublicUserWithSquad> {
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
            include: { squad: squadSelect },
        });
    },

    async getAll(
        filters: UserFilters,
        pagination: PaginationParams,
        sortBy: UserSortBy,
    ): Promise<{ items: PublicUserWithSquad[]; total: number }> {
        const where: Prisma.UserWhereInput = {
            id_squad: filters.id_squad,
            role: filters.role,
            ...(filters.is_active !== undefined && { is_active: filters.is_active }),
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
                include: { squad: squadSelect },
                ...toSkipTake(pagination),
            }),
            prisma.user.count({ where }),
        ]);

        return { items: rows, total };
    },

    async getById(id: string): Promise<PublicUserWithSquad | null> {
        return prisma.user.findUnique({
            where: { id_user: id },
            omit: { password_hash: true },
            include: { squad: squadSelect },
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
    ): Promise<PublicUserWithSquad | null> {
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
                is_active: data.is_active,
                ...(data.is_active === false ? { token_version: { increment: 1 } } : {}),
                ...(data.password_hash === undefined
                    ? {}
                    : { password_hash: data.password_hash }),
            },
            omit: { password_hash: true },
            include: { squad: squadSelect },
        });
    },

    async resetPassword(
        id: string,
        passwordHash: string,
        mustChangePassword: boolean,
    ): Promise<PublicUserWithSquad | null> {
        const existing = await prisma.user.findUnique({
            where: { id_user: id },
        });

        if (!existing) return null;

        return prisma.user.update({
            where: { id_user: id },
            data: {
                password_hash: passwordHash,
                must_change_password: mustChangePassword,
                token_version: { increment: 1 },
            },
            omit: { password_hash: true },
            include: { squad: squadSelect },
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