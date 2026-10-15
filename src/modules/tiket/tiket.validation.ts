import { z } from "zod";

export const createTiketSchema = z.object({
  id_pelanggan: z.uuidv4(),
  id_user: z.uuidv4(),
  id_tahap: z.uuidv4(),
  id_kontak: z.uuidv4().nullable().optional(),
  judul: z.string(),
  estimasi_nilai: z.number(),
  estimasi_closing: z.string(),
  status: z.enum(["open", "won", "lost"]),
  kebutuhan_pelanggan: z.string(),
  prioritas: z.enum(["rendah", "sedang", "tinggi"]),
  posisi: z.number().int(),
  tanggal_penawaran_awal: z.string().nullable().optional(),
  tanggal_closing: z.string().nullable().optional(),
  alasan_lost: z.string().nullable().optional(),
});
