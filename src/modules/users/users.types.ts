export type UserRole = "sales" | "sales_manager" | "director" | "admin";
export type UserSortBy = "created_at" | "nama" | "role";

/** Bentuk lengkap termasuk `password_hash` — hanya untuk keperluan internal (auth). */
export interface User {
    id_user: string;
    id_squad: string | null;
    nama: string;
    role: UserRole;
    email: string;
    no_telp: string;
    password_hash: string;
    is_active: boolean;
    must_change_password: boolean;
    token_version: number;
    created_at: Date | string;
    updated_at: Date | string;
}

/** Bentuk user yang boleh dikirim ke client — tanpa `password_hash`. */
export type PublicUser = Omit<User, "password_hash">;


export type PublicUserWithSquad = PublicUser & {
    squad: { id_squad: string; nama_squad: string } | null;
};

export interface CreateUserInput {
    id_squad?: string | null;
    nama: string;
    role: UserRole;
    email: string;
    no_telp: string;
    /** Password polos dari client; di-hash di service sebelum disimpan. */
    password: string;
    send_credentials?: boolean;
}

export interface UpdateUserInput {
    id_squad?: string | null;
    nama?: string;
    role?: UserRole;
    email?: string;
    no_telp?: string;
    is_active?: boolean;
    /** Bila diisi, password akan di-hash ulang. */
    password?: string;
}

export interface ResetPasswordInput {
    new_password: string;
    must_change_password?: boolean;
}

export interface UserFilters {
    id_squad?: string;
    role?: UserRole;
    search?: string;
    is_active?: boolean;
}

/** Bentuk yang benar-benar dikirim ke database. */
export interface CreateUserRecord extends Omit<CreateUserInput, "password" | "send_credentials"> {
    password_hash: string;
}

export interface UpdateUserRecord extends Omit<UpdateUserInput, "password"> {
    password_hash?: string;
}
