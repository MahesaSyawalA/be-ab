import type { Request, Response } from "express";
import { tahapKanbanService } from "./tahap-kanban.service.ts";
import { tahapKanbanQuerySchema } from "./tahap-kanban.validation.ts";

export const tahapKanbanController = {
  async create(req: Request, res: Response) {
    const tahap = await tahapKanbanService.create(req.body);

    res.status(201).json({
      message: "Tahap Kanban created successfully.",
      data: tahap,
    });
  },

  async getAll(req: Request, res: Response) {
    const parsed = tahapKanbanQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Query tidak valid",
      });
      return;
    }

    const { page, limit, order, ...filters } = parsed.data;
    const { data, meta } = await tahapKanbanService.getAll(filters, { page, limit, order });

    res.status(200).json({ data, meta });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const tahap = await tahapKanbanService.getById(id);

    if (!tahap) {
      res.status(404).json({
        message: "Tahap Kanban not found.",
      });
      return;
    }

    res.status(200).json({
      data: tahap,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const tahap = await tahapKanbanService.update(id, req.body);

    if (!tahap) {
      res.status(404).json({
        message: "Tahap Kanban not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Tahap Kanban updated successfully.",
      data: tahap,
    });
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await tahapKanbanService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "Tahap Kanban not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Tahap Kanban deleted successfully.",
    });
  },
};