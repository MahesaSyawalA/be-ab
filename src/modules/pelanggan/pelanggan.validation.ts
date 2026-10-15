import { z } from "zod";

export const createPelangganSchema = z.object({
  nama_faskes: z.string(),
  tipe_faskes: z.string(),
  alamat: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  radius_kunjungan: z.number(),
  img_url: z.string(),
});
