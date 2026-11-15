import { buildMeta } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { userRepository } from "./users.repository.ts";
import type {
    CreateUserInput,
    PublicUser,
    PublicUserWithSquad,
    ResetPasswordInput,
    UpdateUserInput,
    UserFilters,
    UserSortBy,
} from "./users.types.ts";
import { BCRYPT_COST } from "../../config/auth.ts";
import bcrypt from "bcryptjs";
import { mailer } from "../../lib/mailer.ts";
import { env } from "../../config/env.ts";

export const userService = {
    async create(data: CreateUserInput): Promise<PublicUserWithSquad> {
        const { password, send_credentials, ...rest } = data;
        const password_hash = await bcrypt.hash(password, BCRYPT_COST);

        const user = await userRepository.create({ ...rest, password_hash });
        
        if (send_credentials && env.smtpHost) {
            await mailer.sendNewUserCredentials({
                to: user.email,
                nama: user.nama,
                email: user.email,
                password,
                role: user.role,
            }).catch((err) => {
                console.error("[mailer] Gagal mengirim email kredensial:", err);
            });
        }

        return user;
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

    async getById(id: string): Promise<PublicUserWithSquad | null> {
        return userRepository.getById(id);
    },

    async getBySquadId(idSquad: string): Promise<PublicUser[]> {
        return userRepository.getBySquadId(idSquad);
    },

    async update(
        id: string,
        data: UpdateUserInput
    ): Promise<PublicUserWithSquad | null> {
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

    async resetPassword(
        id: string,
        data: ResetPasswordInput
    ): Promise<PublicUserWithSquad | null> {
        const password_hash = await bcrypt.hash(data.new_password, BCRYPT_COST);
        return userRepository.resetPassword(
            id,
            password_hash,
            data.must_change_password ?? false,
        );
    },

    async delete(id: string): Promise<PublicUser | null> {
        return userRepository.delete(id);
    },
};