import { buildMeta } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { userRepository } from "./users.repository.ts";
import type {
    CreateUserInput,
    PublicUser,
    UpdateUserInput,
    UserFilters,
    UserSortBy,
} from "./users.types.ts";
import { BCRYPT_COST } from "../../config/auth.ts";
import bcrypt from "bcryptjs";

export const userService = {
    async create(data: CreateUserInput): Promise<PublicUser> {
        const { password, ...rest } = data;
        const password_hash = await bcrypt.hash(password, BCRYPT_COST);

        return userRepository.create({ ...rest, password_hash });
    },

    async getAll(
        filters: UserFilters,
        pagination: PaginationParams,
        sortBy: UserSortBy
    ) {
        const { items, total } = await userRepository.getAll(
            filters,
            pagination,
            sortBy
        );

        return {
            data: items,
            meta: buildMeta(total, pagination),
        };
    },

    async getById(id: string): Promise<PublicUser | null> {
        return userRepository.getById(id);
    },

    async getBySquadId(idSquad: string): Promise<PublicUser[]> {
        return userRepository.getBySquadId(idSquad);
    },

    async update(
        id: string,
        data: UpdateUserInput
    ): Promise<PublicUser | null> {
        const { password, ...rest } = data;

        const password_hash =
            password === undefined
                ? undefined
                : await bcrypt.hash(password, BCRYPT_COST);

        return userRepository.update(id, {
            ...rest,
            password_hash,
        });
    },

    async delete(id: string): Promise<PublicUser | null> {
        return userRepository.delete(id);
    },
};