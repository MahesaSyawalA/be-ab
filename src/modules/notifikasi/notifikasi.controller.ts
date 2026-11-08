import type { Request, Response } from "express";
import { notifikasiService } from "./notifikasi.service.ts";
import { notifikasiQuerySchema } from "./notifikasi.validation.ts";

export const notifikasiController = {
  async create(req: Request, res: Response) {
    const notifikasi = await notifikasiService.create(req.body);

    res.status(201).json({
      message: "Notifikasi created successfully.",
      data: notifikasi,
    });
  },

  async getAll(req: Request, res: Response) {
    const parsed = notifikasiQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Query tidak valid",
      });
      return;
    }

    const { page, limit, order, ...filters } = parsed.data;
    const { data, meta } = await notifikasiService.getAll(filters, { page, limit, order });

    res.status(200).json({ data, meta });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const notifikasi = await notifikasiService.getById(id);

    if (!notifikasi) {
      res.status(404).json({
        message: "Notifikasi not found.",
      });
      return;
    }

    res.status(200).json({
      data: notifikasi,
    });
  },

  async markAsRead(req: Request, res: Response) {
    const id = req.params.id as string;
    const notifikasi = await notifikasiService.markAsRead(id);

    if (!notifikasi) {
      res.status(404).json({
        message: "Notifikasi not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Notifikasi marked as read.",
      data: notifikasi,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const notifikasi = await notifikasiService.update(id, req.body);

    if (!notifikasi) {
      res.status(404).json({
        message: "Notifikasi not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Notifikasi updated successfully.",
      data: notifikasi,
    });
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await notifikasiService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "Notifikasi not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Notifikasi deleted successfully.",
    });
  },
};