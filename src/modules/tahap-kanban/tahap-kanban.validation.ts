import { z } from "zod";

export const createTahapKanbanSchema = z.object({
  nama_tahap: z.string(),
  urutan: z.number().int(),
  jenis_tahap: z.enum([
    "visit",
    "kebutuhan",
    "opportunity",
    "follow_up",
    "quotation",
    "po",
    "revenue",
  ]),
  is_tahap_akhir: z.boolean(),
  is_aktif: z.boolean(),
});

export const updateTahapKanbanSchema = createTahapKanbanSchema.partial();
