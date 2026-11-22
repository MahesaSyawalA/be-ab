import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import {
  nonEmptyUpdate,
  requiredString,
} from "../../common/utils/validation.ts";

export const createSquadSchema = z.object({
  id_supervisor: z.uuid({ message: "ID Supervisor tidak valid" }).nullable().optional(),
  nama_squad: requiredString("Nama squad", 100),
  kode_squad: requiredString("Kode squad", 50),
  wilayah: requiredString("Wilayah", 100),
  is_active: z.boolean({ error: "Status aktif wajib diisi (true atau false)" }),
  member_ids: z.array(z.uuid({ message: "ID anggota tidak valid" })).optional(),
});

export const updateSquadSchema = nonEmptyUpdate(createSquadSchema.partial());

export const squadQuerySchema = paginationQuerySchema.extend({
  id_supervisor: z.uuid({ message: "ID Supervisor tidak valid" }).optional(),
  is_active: z
    .enum(["true", "false"], { message: "is_active harus true atau false" })
    .transform((v) => v === "true")
    .optional(),
  wilayah: z.string().trim().min(1, { message: "Wilayah tidak boleh kosong" }).max(100).optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).max(150).optional(),
});
