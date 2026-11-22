import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import {
  nonEmptyUpdate,
  requiredIsoDate,
  requiredNumber,
  requiredString,
  safeHttpUrl,
} from "../../common/utils/validation.ts";

const statusPenawaran = z.enum(["draft", "dikirim", "disetujui", "ditolak"], {
  error: "Status penawaran wajib dipilih (draft, dikirim, disetujui, atau ditolak)",
});

export const createPenawaranSchema = z.object({
  id_tiket: z.uuid({ error: "ID Tiket wajib diisi dengan format UUID yang valid" }),
  id_aktivitas: z.uuid({ message: "ID Aktivitas tidak valid" }).nullable().optional(),
  no_penawaran: requiredString("Nomor penawaran", 100),
  revisi_ke: requiredNumber("Revisi", { int: true, min: 0 }),
  tanggal_penawaran: requiredIsoDate("Tanggal penawaran"),
  total_nilai: requiredNumber("Total nilai", { min: 0 }),
  status: statusPenawaran,
  url_file_penawaran: safeHttpUrl("URL file penawaran", 500),
});

export const updatePenawaranSchema = nonEmptyUpdate(createPenawaranSchema.partial());

export const penawaranQuerySchema = paginationQuerySchema.extend({
  id_tiket: z.uuid({ message: "ID Tiket tidak valid" }).optional(),
  id_aktivitas: z.uuid({ message: "ID Aktivitas tidak valid" }).optional(),
  no_penawaran: z.string().trim().min(1, { message: "Nomor penawaran tidak boleh kosong" }).max(100).optional(),
  status: statusPenawaran.optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).max(150).optional(),
});
