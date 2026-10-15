import { z } from "zod";

export const createUserSchema = z.object({
    id_squad: z.uuidv4().nullable().optional(),
    nama: z.string(),
    role: z.enum(["sales","sales_manager","director"]),
    email: z.email(),
    no_telp: z.string(),
    password_hash: z.string(),
})