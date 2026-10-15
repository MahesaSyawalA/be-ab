import type { PurchaseOrder } from "./purchase-order.types.ts";

const poList: PurchaseOrder[] = [];

export const purchaseOrderRepository = {
  async create(data: PurchaseOrder): Promise<PurchaseOrder> {
    poList.push(data);
    return data;
  },

  async getAll(): Promise<PurchaseOrder[]> {
    return poList;
  },

  async getById(id: string): Promise<PurchaseOrder | undefined> {
    return poList.find((item) => item.id_po === id);
  },

  async getByNoPo(noPo: string): Promise<PurchaseOrder | undefined> {
    return poList.find((item) => item.no_po === noPo);
  },

  async getByPenawaranId(idPenawaran: string): Promise<PurchaseOrder[]> {
    return poList.filter((item) => item.id_penawaran === idPenawaran);
  },

  async getByTiketId(idTiket: string): Promise<PurchaseOrder[]> {
    return poList.filter((item) => item.id_tiket === idTiket);
  },
};
