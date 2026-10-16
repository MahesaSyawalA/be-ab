import { z } from "zod";

export const createRiwayatTahapSchema = z.object({
  id_tiket: z.uuidv4(),
  id_tahap_asal: z.uuidv4().nullable().optional(),
  id_tahap_tujuan: z.uuidv4(),
  id_user: z.uuidv4(),
  waktu_pindah: z.string().optional(),
});

export const updateRiwayatTahapSchema = createRiwayatTahapSchema.partial();
