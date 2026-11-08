import { buildMeta } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { purchaseOrderRepository } from "./purchase-order.repository.ts";
import type {
  PurchaseOrder,
  PurchaseOrderFilters,
  CreatePurchaseOrderInput,
  UpdatePurchaseOrderInput,
} from "./purchase-order.types.ts";

export const purchaseOrderService = {
  async create(data: CreatePurchaseOrderInput): Promise<PurchaseOrder> {
    const existing = await purchaseOrderRepository.getByNoPo(data.no_po);
    if (existing) {
      throw new Error(`Nomor PO '${data.no_po}' already exists.`);
    }

    return purchaseOrderRepository.create(data);
  },

  async getAll(filters: PurchaseOrderFilters, pagination: PaginationParams) {
    const { items, total } = await purchaseOrderRepository.getAll(filters, pagination);
    return { data: items, meta: buildMeta(total, pagination) };
  },

  async getById(id: string): Promise<PurchaseOrder | null> {
    return purchaseOrderRepository.getById(id);
  },

  async getByNoPo(noPo: string): Promise<PurchaseOrder | null> {
    return purchaseOrderRepository.getByNoPo(noPo);
  },

  async getByPenawaranId(idPenawaran: string): Promise<PurchaseOrder[]> {
    return purchaseOrderRepository.getByPenawaranId(idPenawaran);
  },

  async getByTiketId(idTiket: string): Promise<PurchaseOrder[]> {
    return purchaseOrderRepository.getByTiketId(idTiket);
  },

  async update(id: string, data: UpdatePurchaseOrderInput): Promise<PurchaseOrder | null> {
    if (data.no_po) {
      const existing = await purchaseOrderRepository.getByNoPo(data.no_po);
      if (existing && existing.id_po !== id) {
        throw new Error(`Nomor PO '${data.no_po}' already exists.`);
      }
    }
    return purchaseOrderRepository.update(id, data);
  },

  async delete(id: string): Promise<PurchaseOrder | null> {
    return purchaseOrderRepository.delete(id);
  },
};