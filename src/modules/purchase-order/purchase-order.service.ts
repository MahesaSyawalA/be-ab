import { randomUUID } from "node:crypto";
import { purchaseOrderRepository } from "./purchase-order.repository.ts";
import type {
  PurchaseOrder,
  CreatePurchaseOrderInput,
} from "./purchase-order.types.ts";

export const purchaseOrderService = {
  async create(data: CreatePurchaseOrderInput): Promise<PurchaseOrder> {
    const existing = await purchaseOrderRepository.getByNoPo(data.no_po);
    if (existing) {
      throw new Error(`Nomor PO '${data.no_po}' already exists.`);
    }

    const now_timestamptz = new Date().toISOString();

    const po: PurchaseOrder = {
      id_po: randomUUID(),
      id_penawaran: data.id_penawaran ?? null,
      id_tiket: data.id_tiket,
      no_po: data.no_po,
      tanggal_po: data.tanggal_po,
      nilai_po: data.nilai_po,
      status: data.status,
      url_file_po: data.url_file_po,
      nilai_revenue: data.nilai_revenue,
      tanggal_revenue: data.tanggal_revenue ?? null,
      created_at: now_timestamptz,
      updated_at: now_timestamptz,
    };

    return purchaseOrderRepository.create(po);
  },

  async getAll(): Promise<PurchaseOrder[]> {
    return purchaseOrderRepository.getAll();
  },

  async getById(id: string): Promise<PurchaseOrder | undefined> {
    return purchaseOrderRepository.getById(id);
  },

  async getByPenawaranId(idPenawaran: string): Promise<PurchaseOrder[]> {
    return purchaseOrderRepository.getByPenawaranId(idPenawaran);
  },

  async getByTiketId(idTiket: string): Promise<PurchaseOrder[]> {
    return purchaseOrderRepository.getByTiketId(idTiket);
  },
};
