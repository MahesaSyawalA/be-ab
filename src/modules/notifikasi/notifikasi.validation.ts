import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import {
  nonEmptyUpdate,
  requiredString,
} from "../../common/utils/validation.ts";

export const createNotifikasiSchema = z.object({
  id_tiket: z.uuid({ error: "ID Tiket wajib diisi dengan format UUID yang valid" }),
  title: requiredString("Judul notifikasi", 150),
  isRead: z.boolean().optional(),
  message: requiredString("Pesan notifikasi", 2000),
});

export const updateNotifikasiSchema = nonEmptyUpdate(createNotifikasiSchema.partial());

export const notifikasiQuerySchema = paginationQuerySchema.extend({
  id_tiket: z.uuid({ message: "ID Tiket tidak valid" }).optional(),
  isRead: z
    .enum(["true", "false"], { message: "isRead harus true atau false" })
    .transform((v) => v === "true")
    .optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).max(150).optional(),
});
