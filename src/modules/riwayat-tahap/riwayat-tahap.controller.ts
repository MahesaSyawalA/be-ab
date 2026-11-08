import type { Request, Response } from "express";
import { riwayatTahapService } from "./riwayat-tahap.service.ts";
import { riwayatTahapQuerySchema } from "./riwayat-tahap.validation.ts";

export const riwayatTahapController = {
  async create(req: Request, res: Response) {
    const riwayat = await riwayatTahapService.create(req.body);

    res.status(201).json({
      message: "Riwayat Tahap created successfully.",
      data: riwayat,
    });
  },

  async getAll(req: Request, res: Response) {
    const parsed = riwayatTahapQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Query tidak valid",
      });
      return;
    }

    const { page, limit, order, ...filters } = parsed.data;
    const { data, meta } = await riwayatTahapService.getAll(filters, { page, limit, order });

    res.status(200).json({ data, meta });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const riwayat = await riwayatTahapService.getById(id);

    if (!riwayat) {
      res.status(404).json({
        message: "Riwayat Tahap not found.",
      });
      return;
    }

    res.status(200).json({
      data: riwayat,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const riwayat = await riwayatTahapService.update(id, req.body);

    if (!riwayat) {
      res.status(404).json({
        message: "Riwayat Tahap not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Riwayat Tahap updated successfully.",
      data: riwayat,
    });
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await riwayatTahapService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "Riwayat Tahap not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Riwayat Tahap deleted successfully.",
    });
  },
};