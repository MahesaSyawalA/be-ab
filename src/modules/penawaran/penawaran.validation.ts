import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

const statusPenawaran = z.enum(["draft", "dikirim", "disetujui", "ditolak"], {
  message: "Pilih status penawaran yang valid",
});

export const createPenawaranSchema = z.object({
  id_tiket: z.uuid({ message: "ID Tiket tidak valid atau belum dipilih" }),
  id_aktivitas: z.uuid({ message: "ID Aktivitas tidak valid" }).nullable().optional(),
  no_penawaran: z.string().min(1, { message: "Nomor penawaran wajib diisi" }),
  revisi_ke: z.coerce.number({ message: "Revisi harus berupa angka" }).int({ message: "Revisi harus berupa bilangan bulat" }),
  tanggal_penawaran: z.string().min(1, { message: "Tanggal penawaran wajib diisi" }),
  total_nilai: z.coerce.number({ message: "Total nilai harus berupa angka" }),
  status: statusPenawaran,
  url_file_penawaran: z.string().min(1, { message: "File penawaran wajib diupload" }),
});

export const updatePenawaranSchema = createPenawaranSchema.partial();

export const penawaranQuerySchema = paginationQuerySchema.extend({
  id_tiket: z.uuid({ message: "ID Tiket tidak valid" }).optional(),
  id_aktivitas: z.uuid({ message: "ID Aktivitas tidak valid" }).optional(),
  no_penawaran: z.string().trim().min(1, { message: "Nomor penawaran tidak boleh kosong" }).optional(),
  status: statusPenawaran.optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).optional(),
});