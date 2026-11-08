import type { Request, Response } from "express";
import { penawaranService } from "./penawaran.service.ts";
import { penawaranQuerySchema } from "./penawaran.validation.ts";

export const penawaranController = {
  async create(req: Request, res: Response) {
    try {
      const penawaran = await penawaranService.create(req.body);

      res.status(201).json({
        message: "Penawaran created successfully.",
        data: penawaran,
      });
    } catch (error: any) {
      res.status(409).json({
        message: error.message || "Failed to create penawaran.",
      });
    }
  },

  async getAll(req: Request, res: Response) {
    const parsed = penawaranQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Query tidak valid",
      });
      return;
    }

    const { page, limit, order, ...filters } = parsed.data;
    const { data, meta } = await penawaranService.getAll(filters, { page, limit, order });

    res.status(200).json({ data, meta });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const penawaran = await penawaranService.getById(id);

    if (!penawaran) {
      res.status(404).json({
        message: "Penawaran not found.",
      });
      return;
    }

    res.status(200).json({
      data: penawaran,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    try {
      const penawaran = await penawaranService.update(id, req.body);

      if (!penawaran) {
        res.status(404).json({
          message: "Penawaran not found.",
        });
        return;
      }

      res.status(200).json({
        message: "Penawaran updated successfully.",
        data: penawaran,
      });
    } catch (error: any) {
      res.status(409).json({
        message: error.message || "Failed to update penawaran.",
      });
    }
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await penawaranService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "Penawaran not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Penawaran deleted successfully.",
    });
  },
};