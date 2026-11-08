import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import { toSkipTake } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import type {
  PurchaseOrder,
  PurchaseOrderFilters,
  CreatePurchaseOrderInput,
  UpdatePurchaseOrderInput,
} from "./purchase-order.types.ts";

function toDate(val?: string | Date | null): Date | null | undefined {
  if (val === undefined) return undefined;
  if (val === null) return null;
  return new Date(val);
}

export const purchaseOrderRepository = {
  async create(data: CreatePurchaseOrderInput): Promise<PurchaseOrder> {
    return prisma.purchaseOrder.create({
      data: {
        id_penawaran: data.id_penawaran ?? null,
        id_tiket: data.id_tiket,
        no_po: data.no_po,
        tanggal_po: new Date(data.tanggal_po),
        nilai_po: data.nilai_po,
        status: data.status,
        url_file_po: data.url_file_po,
        nilai_revenue: data.nilai_revenue,
        tanggal_revenue: toDate(data.tanggal_revenue),
      },
    });
  },

  async getAll(
    filters: PurchaseOrderFilters,
    pagination: PaginationParams,
  ): Promise<{ items: PurchaseOrder[]; total: number }> {
    const where: Prisma.PurchaseOrderWhereInput = {
      id_penawaran: filters.id_penawaran,
      id_tiket: filters.id_tiket,
      status: filters.status,
      AND: [
        ...(filters.no_po ? [{ no_po: filters.no_po }] : []),
        ...(filters.search ? [{ no_po: { contains: filters.search } }] : []),
      ],
    };

    const [items, total] = await prisma.$transaction([
      prisma.purchaseOrder.findMany({
        where,
        orderBy: [{ created_at: pagination.order }, { id_po: "asc" }],
        ...toSkipTake(pagination),
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    return { items, total };
  },

  async getById(id: string): Promise<PurchaseOrder | null> {
    return prisma.purchaseOrder.findUnique({
      where: { id_po: id },
    });
  },

  async getByNoPo(noPo: string): Promise<PurchaseOrder | null> {
    return prisma.purchaseOrder.findUnique({
      where: { no_po: noPo },
    });
  },

  async getByPenawaranId(idPenawaran: string): Promise<PurchaseOrder[]> {
    return prisma.purchaseOrder.findMany({
      where: { id_penawaran: idPenawaran },
      orderBy: { created_at: "desc" },
    });
  },

  async getByTiketId(idTiket: string): Promise<PurchaseOrder[]> {
    return prisma.purchaseOrder.findMany({
      where: { id_tiket: idTiket },
      orderBy: { created_at: "desc" },
    });
  },

  async update(id: string, data: UpdatePurchaseOrderInput): Promise<PurchaseOrder | null> {
    const existing = await prisma.purchaseOrder.findUnique({ where: { id_po: id } });
    if (!existing) return null;

    return prisma.purchaseOrder.update({
      where: { id_po: id },
      data: {
        ...(data.id_penawaran !== undefined && { id_penawaran: data.id_penawaran }),
        ...(data.id_tiket !== undefined && { id_tiket: data.id_tiket }),
        ...(data.no_po !== undefined && { no_po: data.no_po }),
        ...(data.tanggal_po !== undefined && { tanggal_po: new Date(data.tanggal_po) }),
        ...(data.nilai_po !== undefined && { nilai_po: data.nilai_po }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.url_file_po !== undefined && { url_file_po: data.url_file_po }),
        ...(data.nilai_revenue !== undefined && { nilai_revenue: data.nilai_revenue }),
        ...(data.tanggal_revenue !== undefined && { tanggal_revenue: toDate(data.tanggal_revenue) }),
      },
    });
  },

  async delete(id: string): Promise<PurchaseOrder | null> {
    const existing = await prisma.purchaseOrder.findUnique({ where: { id_po: id } });
    if (!existing) return null;

    return prisma.purchaseOrder.delete({
      where: { id_po: id },
    });
  },
};