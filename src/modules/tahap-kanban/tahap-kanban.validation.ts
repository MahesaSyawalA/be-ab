import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import {
  nonEmptyUpdate,
  optionalString,
  requiredNumber,
  requiredString,
} from "../../common/utils/validation.ts";

const jenisTahap = z.enum(
  ["visit", "kebutuhan", "opportunity", "follow_up", "quotation", "po", "revenue"],
  { error: "Jenis tahap wajib dipilih" },
);

const booleanQuery = (name: string) =>
  z
    .enum(["true", "false"], { message: `${name} harus true atau false` })
    .transform((v) => v === "true");

export const createTahapKanbanSchema = z.object({
  nama_tahap: requiredString("Nama tahap", 100),
  urutan: requiredNumber("Urutan", { int: true, min: 1 }),
  jenis_tahap: jenisTahap,
  is_tahap_akhir: z.boolean({ error: "Status tahap akhir wajib diisi (true atau false)" }),
  is_aktif: z.boolean({ error: "Status aktif wajib diisi (true atau false)" }),
  dotColor: optionalString("Dot color", 50),
});

export const updateTahapKanbanSchema = nonEmptyUpdate(createTahapKanbanSchema.partial());

export const tahapKanbanQuerySchema = paginationQuerySchema.extend({
  order: z.enum(["asc", "desc"], { message: "Order harus asc atau desc" }).default("asc"),
  jenis_tahap: jenisTahap.optional(),
  is_aktif: booleanQuery("is_aktif").optional(),
  is_tahap_akhir: booleanQuery("is_tahap_akhir").optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).max(150).optional(),
});
