import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import {
  nonEmptyUpdate,
  optionalIsoDate,
  optionalNumber,
  optionalString,
  requiredIsoDate,
  requiredNumber,
  requiredString,
} from "../../common/utils/validation.ts";

const tiketStatus = z.enum(["open", "won", "lost"], {
  error: "Status tiket wajib dipilih (open, won, atau lost)",
});
const tiketPrioritas = z.enum(["rendah", "sedang", "tinggi"], {
  error: "Prioritas tiket wajib dipilih (rendah, sedang, atau tinggi)",
});

export const createTiketSchema = z.object({
  id_pelanggan: z.uuid({ error: "ID Pelanggan wajib diisi dengan format UUID yang valid" }),
  id_user: z.uuid({ error: "ID User wajib diisi dengan format UUID yang valid" }),
  id_tahap: z.uuid({ error: "ID Tahap wajib diisi dengan format UUID yang valid" }),
  id_kontak: z.uuid({ message: "ID Kontak tidak valid" }).nullable().optional(),
  judul: requiredString("Judul tiket", 200),
  estimasi_nilai: requiredNumber("Estimasi nilai", { min: 0 }),
  estimasi_closing: requiredIsoDate("Estimasi closing"),
  status: tiketStatus,
  kebutuhan_pelanggan: requiredString("Kebutuhan pelanggan", 2000),
  prioritas: tiketPrioritas,
  posisi: requiredNumber("Posisi", { int: true, min: 0 }),
  tanggal_penawaran_awal: optionalIsoDate("Tanggal penawaran awal").nullable(),
  tanggal_closing: optionalIsoDate("Tanggal closing").nullable(),
  alasan_lost: optionalString("Alasan lost", 1000).nullable(),
  tanggal_dokumen: optionalIsoDate("Tanggal dokumen").nullable(),
});

export const updateTiketSchema = nonEmptyUpdate(
  createTiketSchema.partial().extend({
    create_stage_document: z.boolean().optional(),
    nilai_dokumen: optionalNumber("Nilai dokumen", { min: 0 }),
  })
);

export const tiketQuerySchema = paginationQuerySchema.extend({
  sort_by: z
    .enum(["created_at", "posisi", "estimasi_closing", "estimasi_nilai"], {
      message: "sort_by harus created_at, posisi, estimasi_closing, atau estimasi_nilai",
    })
    .default("created_at"),
  id_pelanggan: z.uuid({ message: "ID Pelanggan tidak valid" }).optional(),
  id_user: z.uuid({ message: "ID User tidak valid" }).optional(),
  id_tahap: z.uuid({ message: "ID Tahap tidak valid" }).optional(),
  id_kontak: z.uuid({ message: "ID Kontak tidak valid" }).optional(),
  status: tiketStatus.optional(),
  prioritas: tiketPrioritas.optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).max(150).optional(),
});
