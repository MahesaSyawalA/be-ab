import type { Request, Response } from "express";
import { squadService } from "./squad.service.ts";
import { squadQuerySchema } from "./squad.validation.ts";

export const squadsController = {
  async create(req: Request, res: Response) {
    const squad = await squadService.create(req.body);

    res.status(201).json({
      message: "Squad created successfully.",
      data: squad,
    });
  },

  async getAll(req: Request, res: Response) {
    const parsed = squadQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Query tidak valid",
      });
      return;
    }

    const { page, limit, order, ...filters } = parsed.data;
    const { data, meta } = await squadService.getAll(filters, { page, limit, order });

    res.status(200).json({ data, meta });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const squad = await squadService.getById(id);

    if (!squad) {
      res.status(404).json({
        message: "Squad not found.",
      });
      return;
    }

    res.status(200).json({
      data: squad,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const squad = await squadService.update(id, req.body);

    if (!squad) {
      res.status(404).json({
        message: "Squad not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Squad updated successfully.",
      data: squad,
    });
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await squadService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "Squad not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Squad deleted successfully.",
    });
  },
};