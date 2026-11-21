import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

const tiketStatus = z.enum(["open", "won", "lost"], { message: "Pilih status tiket yang valid" });
const tiketPrioritas = z.enum(["rendah", "sedang", "tinggi"], { message: "Pilih prioritas tiket yang valid" });

export const createTiketSchema = z.object({
  id_pelanggan: z.uuid({ message: "ID Pelanggan tidak valid atau belum dipilih" }),
  id_user: z.uuid({ message: "ID User tidak valid" }),
  id_tahap: z.uuid({ message: "ID Tahap tidak valid atau belum dipilih" }),
  id_kontak: z.uuid({ message: "ID Kontak tidak valid" }).nullable().optional(),
  judul: z.string().min(1, { message: "Judul tiket wajib diisi" }),
  estimasi_nilai: z.coerce.number({ message: "Estimasi nilai harus berupa angka" }),
  estimasi_closing: z.string().min(1, { message: "Estimasi closing wajib diisi" }),
  status: tiketStatus,
  kebutuhan_pelanggan: z.string().min(1, { message: "Kebutuhan pelanggan wajib diisi" }),
  prioritas: tiketPrioritas,
  posisi: z.coerce.number({ message: "Posisi harus berupa angka" }).int({ message: "Posisi harus berupa bilangan bulat" }),
  tanggal_penawaran_awal: z.string().nullable().optional(),
  tanggal_closing: z.string().nullable().optional(),
  alasan_lost: z.string().nullable().optional(),
  tanggal_dokumen: z.string().nullable().optional(),
});

export const updateTiketSchema = createTiketSchema.partial().extend({
  create_stage_document: z.boolean().optional(),
  nilai_dokumen: z.coerce.number().optional(),
});

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
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).optional(),
});