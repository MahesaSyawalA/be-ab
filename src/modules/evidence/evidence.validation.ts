import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

const jenisEvidence = z.enum(["foto", "audio", "dokumen", "teks"], {
  message: "Tipe evidence harus salah satu dari: foto, audio, dokumen, teks",
});

export const createEvidenceSchema = z.object({
  id_aktivitas: z.uuid({ message: "ID Aktivitas tidak valid" }),
  tipe: jenisEvidence,
  durasi_audio: z.string().max(50, { message: "Durasi audio maksimal 50 karakter" }).nullable().optional(),
  deskripsi: z.string().min(1, { message: "Deskripsi wajib diisi" }),
  catatan: z.string().nullable().optional(),
});

export const updateEvidenceSchema = createEvidenceSchema.partial();

export const evidenceQuerySchema = paginationQuerySchema.extend({
  id_aktivitas: z.uuid({ message: "ID Aktivitas tidak valid" }).optional(),
  tipe: jenisEvidence.optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).optional(),
});