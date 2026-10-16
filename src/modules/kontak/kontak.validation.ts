import { z } from "zod";

export const createKontakSchema = z.object({
  id_pelanggan: z.uuidv4(),
  nama: z.string(),
  jabatan: z.string(),
  no_telp: z.string(),
  email: z.email(),
});

export const updateKontakSchema = createKontakSchema.partial();
