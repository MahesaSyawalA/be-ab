import type { Request, Response } from "express";
import { tiketService } from "./tiket.service.ts";
import { tiketQuerySchema } from "./tiket.validation.ts";

export const tiketController = {
  async create(req: Request, res: Response) {
    const tiket = await tiketService.create(req.body);

    res.status(201).json({
      message: "Tiket created successfully.",
      data: tiket,
    });
  },

  async getAll(req: Request, res: Response) {
    const parsed = tiketQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Query tidak valid",
      });
      return;
    }

    const { page, limit, order, sort_by, ...filters } = parsed.data;
    const { data, meta } = await tiketService.getAll(filters, { page, limit, order }, sort_by);

    res.status(200).json({ data, meta });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const tiket = await tiketService.getById(id);

    if (!tiket) {
      res.status(404).json({
        message: "Tiket not found.",
      });
      return;
    }

    res.status(200).json({
      data: tiket,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const tiket = await tiketService.update(id, req.body);

    if (!tiket) {
      res.status(404).json({
        message: "Tiket not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Tiket updated successfully.",
      data: tiket,
    });
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await tiketService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "Tiket not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Tiket deleted successfully.",
    });
  },
};