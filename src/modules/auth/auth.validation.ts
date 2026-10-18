import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  // Batas 72 byte karena bcrypt hanya memproses 72 byte pertama.
  password: z.string().min(1).max(72),
});
