import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

export const createNotifikasiSchema = z.object({
  id_tiket: z.uuid({ message: "ID Tiket tidak valid atau belum dipilih" }),
  title: z.string().min(1, { message: "Judul notifikasi wajib diisi" }),
  isRead: z.boolean().optional(),
  message: z.string().min(1, { message: "Pesan notifikasi tidak boleh kosong" }),
});

export const updateNotifikasiSchema = createNotifikasiSchema.partial();

export const notifikasiQuerySchema = paginationQuerySchema.extend({
  id_tiket: z.uuid({ message: "ID Tiket tidak valid" }).optional(),
  isRead: z
    .enum(["true", "false"], { message: "isRead harus true atau false" })
    .transform((v) => v === "true")
    .optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).optional(),
});