import { z } from "zod";

export const createPurchaseOrderSchema = z.object({
  id_penawaran: z.uuidv4().nullable().optional(),
  id_tiket: z.uuidv4(),
  no_po: z.string(),
  tanggal_po: z.string(),
  nilai_po: z.number(),
  status: z.enum(["diterima", "diproses", "selesai", "dibatalkan"]),
  url_file_po: z.string(),
  nilai_revenue: z.number(),
  tanggal_revenue: z.string().nullable().optional(),
});

export const updatePurchaseOrderSchema = createPurchaseOrderSchema.partial();
