import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

const jenisTahap = z.enum(
  ["visit", "kebutuhan", "opportunity", "follow_up", "quotation", "po", "revenue"],
  { message: "Pilih jenis tahap yang valid" },
);

const booleanQuery = (name: string) =>
  z
    .enum(["true", "false"], { message: `${name} harus true atau false` })
    .transform((v) => v === "true");

export const createTahapKanbanSchema = z.object({
  nama_tahap: z.string().min(1, { message: "Nama tahap wajib diisi" }),
  urutan: z.coerce.number({ message: "Urutan harus berupa angka" }).int({ message: "Urutan harus berupa bilangan bulat" }),
  jenis_tahap: jenisTahap,
  is_tahap_akhir: z.boolean({ message: "Status tahap akhir wajib diisi dengan format yang benar" }),
  is_aktif: z.boolean({ message: "Status aktif wajib diisi dengan format yang benar" }),
  dotColor: z.string().optional(),
});

export const updateTahapKanbanSchema = createTahapKanbanSchema.partial();

export const tahapKanbanQuerySchema = paginationQuerySchema.extend({
  order: z.enum(["asc", "desc"], { message: "Order harus asc atau desc" }).default("asc"),
  jenis_tahap: jenisTahap.optional(),
  is_aktif: booleanQuery("is_aktif").optional(),
  is_tahap_akhir: booleanQuery("is_tahap_akhir").optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).optional(),
});