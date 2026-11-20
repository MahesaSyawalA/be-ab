import { z } from "zod";

const tanggal = z.iso.date({ message: "Format tanggal harus YYYY-MM-DD" });

export const analyticsQuerySchema = z.object({
  from: tanggal.optional(),
  to: tanggal.optional(),
  id_user: z.uuid({ message: "ID User tidak valid" }).optional(),
  id_squad: z.uuid({ message: "ID Squad tidak valid" }).optional(),
  tipe_outlet: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
