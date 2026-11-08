import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

const jenisKegiatan = z.enum(
  ["visit", "kebutuhan", "opportunity", "follow_up", "quotation", "po", "revenue"],
  { message: "Pilih salah satu jenis kegiatan yang tersedia" },
);

export const createAktivitasSchema = z.object({
  id_user: z.uuid({ message: "ID User tidak valid atau belum ditemukan" }),
  id_tiket: z.uuid({ message: "Pilih tiket yang sesuai terlebih dahulu" }),
  tanggal: z.string().min(1, { message: "Tanggal aktivitas wajib diisi" }),
  catatan: z.string().min(5, { message: "Catatan terlalu pendek, minimal isi 5 karakter" }),
  jenis_kegiatan: jenisKegiatan,
  jadwal_follow_up: z.string().nullable().optional(),
});

export const updateAktivitasSchema = createAktivitasSchema.partial();

export const aktivitasQuerySchema = paginationQuerySchema.extend({
  id_user: z.uuid({ message: "ID User tidak valid" }).optional(),
  id_tiket: z.uuid({ message: "ID Tiket tidak valid" }).optional(),
  jenis_kegiatan: jenisKegiatan.optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).optional(),
});