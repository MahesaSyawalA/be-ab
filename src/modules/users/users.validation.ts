import { z } from "zod";

export const createUserSchema = z.object({
    id_squad: z.uuidv4().nullable().optional(),
    nama: z.string(),
    role: z.enum(["sales", "sales_manager", "director"]),
    email: z.string().trim().toLowerCase().pipe(z.email()),
    no_telp: z.string(),
    // Batas 72 byte karena bcrypt hanya memproses 72 byte pertama.
    password: z.string().min(8).max(72),
});

export const updateUserSchema = createUserSchema.partial();
