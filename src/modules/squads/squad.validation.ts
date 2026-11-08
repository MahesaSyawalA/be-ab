import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

export const createSquadSchema = z.object({
  id_supervisor: z.uuid({ message: "ID Supervisor tidak valid" }).nullable().optional(),
  nama_squad: z.string().min(1, { message: "Nama squad wajib diisi" }),
  kode_squad: z.string().min(1, { message: "Kode squad wajib diisi" }),
  wilayah: z.string().min(1, { message: "Wilayah wajib diisi" }),
  is_active: z.boolean({ message: "Status aktif wajib diisi dengan format yang benar" }),
  member_ids: z.array(z.uuid({ message: "ID anggota tidak valid" })).optional(),
});

export const updateSquadSchema = createSquadSchema.partial();

export const squadQuerySchema = paginationQuerySchema.extend({
  id_supervisor: z.uuid({ message: "ID Supervisor tidak valid" }).optional(),
  is_active: z
    .enum(["true", "false"], { message: "is_active harus true atau false" })
    .transform((v) => v === "true")
    .optional(),
  wilayah: z.string().trim().min(1, { message: "Wilayah tidak boleh kosong" }).optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).optional(),
});