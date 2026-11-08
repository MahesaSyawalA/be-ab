import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

export const createUserSchema = z.object({
    id_squad: z.uuidv4().nullable().optional(),
    nama: z.string(),
    role: z.enum(["sales", "sales_manager", "director"]),
    email: z.string().trim().toLowerCase().pipe(z.email()),
    no_telp: z.string(),
    password: z.string().min(8).max(72),
});

export const updateUserSchema = createUserSchema.partial();

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

    search: z
        .string()
        .trim()
        .min(1, { message: "Search tidak boleh kosong" })
        .optional(),
});