import { z } from "zod";

export const createPenawaranSchema = z.object({
  id_tiket: z.uuidv4(),
  id_aktivitas: z.uuidv4().nullable().optional(),
  no_penawaran: z.string(),
  revisi_ke: z.number().int(),
  tanggal_penawaran: z.string(),
  total_nilai: z.number(),
  status: z.enum(["draft", "dikirim", "disetujui", "ditolak"]),
  url_file_penawaran: z.string(),
});

export const updatePenawaranSchema = createPenawaranSchema.partial();
