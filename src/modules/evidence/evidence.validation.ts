import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import {
  optionalString,
  requiredString,
} from "../../common/utils/validation.ts";

const jenisEvidence = z.enum(["foto", "audio", "dokumen", "teks"], {
  error: "Tipe evidence wajib dipilih (foto, audio, dokumen, atau teks)",
});

export const createEvidenceSchema = z.object({
  id_aktivitas: z.uuid({
    error: "ID Aktivitas wajib diisi dengan format UUID yang valid",
  }),
  tipe: jenisEvidence,
  durasi_audio: optionalString("Durasi audio", 50).nullable(),
  deskripsi: requiredString("Deskripsi", 2000),
  catatan: optionalString("Catatan", 2000).nullable(),
});

export const updateEvidenceSchema = createEvidenceSchema.partial();

export const evidenceQuerySchema = paginationQuerySchema.extend({
  id_aktivitas: z.uuid({ message: "ID Aktivitas tidak valid" }).optional(),
  tipe: jenisEvidence.optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).max(150).optional(),
});
