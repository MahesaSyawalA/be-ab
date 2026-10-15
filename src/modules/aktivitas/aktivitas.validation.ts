import { z } from "zod";

export const createAktivitasSchema = z.object({
  id_user: z.uuidv4(),
  id_tiket: z.uuidv4(),
  tanggal: z.string(),
  catatan: z.string(),
  jenis_kegiatan: z.enum([
    "kunjungan",
    "follow_up",
    "penawaran",
    "closing"
  ]),
  jadwal_follow_up: z.string().nullable().optional(),
});
