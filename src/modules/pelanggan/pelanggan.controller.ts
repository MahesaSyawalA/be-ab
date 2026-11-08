import type { Request, Response } from "express";
import { pelangganService } from "./pelanggan.service.ts";
import { pelangganQuerySchema } from "./pelanggan.validation.ts";

export const pelangganController = {
  async create(req: Request, res: Response) {
    const pelanggan = await pelangganService.create(req.body, req.file);

    res.status(201).json({
      message: "Pelanggan created successfully.",
      data: pelanggan,
    });
  },

  async getAll(req: Request, res: Response) {
    const parsed = pelangganQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Query tidak valid",
      });
      return;
    }

    const { page, limit, order, ...filters } = parsed.data;
    const { data, meta } = await pelangganService.getAll(filters, { page, limit, order });

    res.status(200).json({ data, meta });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const pelanggan = await pelangganService.getById(id);

    if (!pelanggan) {
      res.status(404).json({
        message: "Pelanggan not found.",
      });
      return;
    }

    res.status(200).json({
      data: pelanggan,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const pelanggan = await pelangganService.update(id, req.body, req.file);

    if (!pelanggan) {
      res.status(404).json({
        message: "Pelanggan not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Pelanggan updated successfully.",
      data: pelanggan,
    });
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await pelangganService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "Pelanggan not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Pelanggan deleted successfully.",
    });
  },
};