export type StatusPurchaseOrder =
  | "diterima"
  | "diproses"
  | "selesai"
  | "dibatalkan";

export interface PurchaseOrder {
  id_po: string;
  id_penawaran: string | null;
  id_tiket: string;
  no_po: string;
  tanggal_po: string;
  nilai_po: number;
  status: StatusPurchaseOrder;
  url_file_po: string;
  nilai_revenue: number;
  tanggal_revenue: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePurchaseOrderInput {
  id_penawaran?: string | null;
  id_tiket: string;
  no_po: string;
  tanggal_po: string;
  nilai_po: number;
  status: StatusPurchaseOrder;
  url_file_po: string;
  nilai_revenue: number;
  tanggal_revenue?: string | null;
}
