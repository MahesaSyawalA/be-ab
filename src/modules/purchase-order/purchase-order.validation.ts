import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

const statusPurchaseOrder = z.enum(["diterima", "diproses", "selesai", "dibatalkan"], {
  message: "Pilih status PO yang valid",
});

export const createPurchaseOrderSchema = z.object({
  id_penawaran: z.uuid({ message: "ID Penawaran tidak valid" }).nullable().optional(),
  id_tiket: z.uuid({ message: "ID Tiket tidak valid atau belum dipilih" }),
  no_po: z.string().min(1, { message: "Nomor PO wajib diisi" }),
  tanggal_po: z.string().min(1, { message: "Tanggal PO wajib diisi" }),
  nilai_po: z.coerce.number({ message: "Nilai PO harus berupa angka" }),
  status: statusPurchaseOrder,
  url_file_po: z.string().min(1, { message: "File PO wajib diupload" }),
  nilai_revenue: z.coerce.number({ message: "Nilai revenue harus berupa angka" }),
  tanggal_revenue: z.string().nullable().optional(),
});

export const updatePurchaseOrderSchema = createPurchaseOrderSchema.partial();

export const purchaseOrderQuerySchema = paginationQuerySchema.extend({
  id_penawaran: z.uuid({ message: "ID Penawaran tidak valid" }).optional(),
  id_tiket: z.uuid({ message: "ID Tiket tidak valid" }).optional(),
  no_po: z.string().trim().min(1, { message: "Nomor PO tidak boleh kosong" }).optional(),
  status: statusPurchaseOrder.optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).optional(),
});