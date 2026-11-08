import type { Request, Response } from "express";
import { aktivitasService } from "./aktivitas.service.ts";
import { aktivitasQuerySchema } from "./aktivitas.validation.ts";

export const aktivitasController = {
  async create(req: Request, res: Response) {
    const aktivitas = await aktivitasService.create(req.body);

    res.status(201).json({
      message: "Aktivitas created successfully.",
      data: aktivitas,
    });
  },

  async getAll(req: Request, res: Response) {
    const parsed = aktivitasQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Query tidak valid",
      });
      return;
    }

    const { page, limit, order, ...filters } = parsed.data;
    const { data, meta } = await aktivitasService.getAll(filters, { page, limit, order });

    res.status(200).json({ data, meta });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const aktivitas = await aktivitasService.getById(id);

    if (!aktivitas) {
      res.status(404).json({
        message: "Aktivitas not found.",
      });
      return;
    }

    res.status(200).json({
      data: aktivitas,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const aktivitas = await aktivitasService.update(id, req.body);

    if (!aktivitas) {
      res.status(404).json({
        message: "Aktivitas not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Aktivitas updated successfully.",
      data: aktivitas,
    });
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await aktivitasService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "Aktivitas not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Aktivitas deleted successfully.",
    });
  },
};