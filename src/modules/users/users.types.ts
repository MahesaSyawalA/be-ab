export type UserRole = "sales" | "sales_manager" | "director";

export interface User {
    id_user: string;
    id_squad: string;
    nama: string;
    role: UserRole;
    email: string;
    no_telp: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
}

export interface CreateUserInput {
    id_squad: string;
    nama: string;
    role: UserRole;
    email: string;
    no_telp: string;
    password_hash: string;
}