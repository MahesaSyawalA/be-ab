import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

export const createBuktiKunjunganSchema = z.object({
  id_aktivitas: z.uuid({ message: "ID Aktivitas tidak valid atau belum dipilih" }),
  longitude: z.coerce.number({ message: "Longitude harus berupa angka" }),
  latitude: z.coerce.number({ message: "Latitude harus berupa angka" }),
  jarak_klien: z.coerce.number({ message: "Jarak harus berupa angka" }),
  dalam_radius: z.enum(["true", "false"], { message: "Status radius wajib diisi dengan format yang benar" }).transform((v) => v === "true"),
  // img_url: z.string().min(1, { message: "Bukti foto kunjungan wajib diupload" }),
  // file_url: z.string().optional(),
});

export const updateBuktiKunjunganSchema = createBuktiKunjunganSchema.partial();

export const buktiKunjunganQuerySchema = paginationQuerySchema.extend({
  id_aktivitas: z.uuid({ message: "ID Aktivitas tidak valid" }).optional(),
  dalam_radius: z
    .enum(["true", "false"], { message: "dalam_radius harus true atau false" })
    .transform((v) => v === "true")
    .optional(),
});