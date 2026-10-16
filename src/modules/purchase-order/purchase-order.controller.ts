import type { Request, Response } from "express";
import { purchaseOrderService } from "./purchase-order.service.ts";

export const purchaseOrderController = {
  async create(req: Request, res: Response) {
    try {
      const po = await purchaseOrderService.create(req.body);

      res.status(201).json({
        message: "Purchase Order created successfully.",
        data: po,
      });
    } catch (error: any) {
      res.status(409).json({
        message: error.message || "Failed to create purchase order.",
      });
    }
  },

  async getAll(req: Request, res: Response) {
    const { id_penawaran, id_tiket, no_po } = req.query;

    if (typeof no_po === "string") {
      const po = await purchaseOrderService.getByNoPo(no_po);
      if (!po) {
        res.status(404).json({ message: "Purchase Order not found." });
        return;
      }
      res.status(200).json({ data: po });
      return;
    }

    if (typeof id_penawaran === "string") {
      const data = await purchaseOrderService.getByPenawaranId(id_penawaran);
      res.status(200).json({ data });
      return;
    }

    if (typeof id_tiket === "string") {
      const data = await purchaseOrderService.getByTiketId(id_tiket);
      res.status(200).json({ data });
      return;
    }

    const data = await purchaseOrderService.getAll();
    res.status(200).json({ data });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const po = await purchaseOrderService.getById(id);

    if (!po) {
      res.status(404).json({
        message: "Purchase Order not found.",
      });
      return;
    }

    res.status(200).json({
      data: po,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    try {
      const po = await purchaseOrderService.update(id, req.body);

      if (!po) {
        res.status(404).json({
          message: "Purchase Order not found.",
        });
        return;
      }

      res.status(200).json({
        message: "Purchase Order updated successfully.",
        data: po,
      });
    } catch (error: any) {
      res.status(409).json({
        message: error.message || "Failed to update purchase order.",
      });
    }
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await purchaseOrderService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "Purchase Order not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Purchase Order deleted successfully.",
    });
  },
};
