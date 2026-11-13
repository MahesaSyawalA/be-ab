import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

export const createUserSchema = z.object({
    id_squad: z.uuidv4().nullable().optional(),
    nama: z.string(),
    role: z.enum(["sales", "sales_manager", "director"]),
    email: z.string().trim().toLowerCase().pipe(z.email()),
    no_telp: z.string(),
    password: z.string().min(8).max(72),
    send_credentials: z.boolean().optional(),
});

export const updateUserSchema = z.object({
    id_squad: z.uuidv4().nullable().optional(),
    nama: z.string().optional(),
    role: z.enum(["sales", "sales_manager", "director"]).optional(),
    email: z.string().trim().toLowerCase().pipe(z.email()).optional(),
    no_telp: z.string().optional(),
    is_active: z.boolean().optional(),
    password: z.string().min(8).max(72).optional(),
});

export const resetPasswordSchema = z.object({
    new_password: z.string().min(8).max(72),
    must_change_password: z.boolean().optional(),
});

export const userQuerySchema = paginationQuerySchema.extend({
    sort_by: z
        .enum(["created_at", "nama", "role"], {
            message: "sort_by harus created_at, nama, atau role",
        })
        .default("created_at"),

    id_squad: z.uuidv4({ message: "ID Squad tidak valid" }).optional(),

    role: z
        .enum(["sales", "sales_manager", "director"], {
            message: "Pilih role user yang valid",
        })
        .optional(),

    is_active: z
        .enum(["true", "false"], { message: "is_active harus true atau false" })
        .transform((v) => v === "true")
        .optional(),

    search: z
        .string()
        .trim()
        .min(1, { message: "Search tidak boleh kosong" })
        .optional(),
});