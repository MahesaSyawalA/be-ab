import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import {
  nonEmptyUpdate,
  optionalIsoDate,
  optionalNumber,
  requiredIsoDate,
  requiredString,
} from "../../common/utils/validation.ts";

const jenisKegiatan = z.enum(
  ["visit", "kebutuhan", "opportunity", "follow_up", "quotation", "po", "revenue"],
  { error: "Jenis kegiatan wajib dipilih" },
);

export const createAktivitasSchema = z.object({
  id_user: z.uuid({ error: "ID User wajib diisi dengan format UUID yang valid" }),
  id_tiket: z.uuid({ error: "ID Tiket wajib diisi dengan format UUID yang valid" }),
  tanggal: requiredIsoDate("Tanggal aktivitas"),
  catatan: requiredString("Catatan", 2000, 5),
  jenis_kegiatan: jenisKegiatan,
  jadwal_follow_up: optionalIsoDate("Jadwal follow up").nullable(),
  total_nilai: optionalNumber("Total nilai", { min: 0 }),
});

export const updateAktivitasSchema = nonEmptyUpdate(createAktivitasSchema.partial());

export const aktivitasQuerySchema = paginationQuerySchema.extend({
  id_user: z.uuid({ message: "ID User tidak valid" }).optional(),
  id_tiket: z.uuid({ message: "ID Tiket tidak valid" }).optional(),
  jenis_kegiatan: jenisKegiatan.optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).max(150).optional(),
});
