import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "Email wajib diisi" })
    .trim()
    .min(1, { message: "Email wajib diisi" })
    .max(150, { message: "Email maksimal 150 karakter" })
    .toLowerCase()
    .pipe(z.email({ message: "Format email tidak valid" })),
  // Batas 72 byte karena bcrypt hanya memproses 72 byte pertama.
  password: z
    .string({ error: "Password wajib diisi" })
    .min(1, { message: "Password wajib diisi" })
    .max(72, { message: "Password maksimal 72 karakter" }),
});

export const changePasswordSchema = z.object({
  current_password: z
    .string({ error: "Password saat ini wajib diisi" })
    .min(1, { message: "Password saat ini wajib diisi" })
    .max(72, { message: "Password saat ini maksimal 72 karakter" }),
  new_password: z
    .string({ error: "Password baru wajib diisi" })
    .min(8, { message: "Password baru minimal 8 karakter" })
    .max(72, { message: "Password baru maksimal 72 karakter" }),
});
