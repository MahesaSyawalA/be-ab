import { z } from "zod";

export const createBuktiKunjunganSchema = z.object({
  id_aktivitas: z.uuidv4(),
  longitude: z.number(),
  latitude: z.number(),
  jarak_klien: z.number(),
  dalam_radius: z.boolean(),
  img_url: z.string(),
});

export const updateBuktiKunjunganSchema = createBuktiKunjunganSchema.partial();
