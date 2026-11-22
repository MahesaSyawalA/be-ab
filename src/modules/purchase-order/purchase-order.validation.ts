import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import {
  nonEmptyUpdate,
  optionalIsoDate,
  requiredIsoDate,
  requiredNumber,
  requiredString,
  safeHttpUrl,
} from "../../common/utils/validation.ts";

const statusPurchaseOrder = z.enum(["diterima", "diproses", "selesai", "dibatalkan"], {
  error: "Status PO wajib dipilih (diterima, diproses, selesai, atau dibatalkan)",
});

export const createPurchaseOrderSchema = z.object({
  id_penawaran: z.uuid({ message: "ID Penawaran tidak valid" }).nullable().optional(),
  id_tiket: z.uuid({ error: "ID Tiket wajib diisi dengan format UUID yang valid" }),
  no_po: requiredString("Nomor PO", 100),
  tanggal_po: requiredIsoDate("Tanggal PO"),
  nilai_po: requiredNumber("Nilai PO", { min: 0 }),
  status: statusPurchaseOrder,
  url_file_po: safeHttpUrl("URL file PO", 500),
  nilai_revenue: requiredNumber("Nilai revenue", { min: 0 }),
  tanggal_revenue: optionalIsoDate("Tanggal revenue").nullable(),
});

export const updatePurchaseOrderSchema = nonEmptyUpdate(createPurchaseOrderSchema.partial());

export const purchaseOrderQuerySchema = paginationQuerySchema.extend({
  id_penawaran: z.uuid({ message: "ID Penawaran tidak valid" }).optional(),
  id_tiket: z.uuid({ message: "ID Tiket tidak valid" }).optional(),
  no_po: z.string().trim().min(1, { message: "Nomor PO tidak boleh kosong" }).max(100).optional(),
  status: statusPurchaseOrder.optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).max(150).optional(),
});
