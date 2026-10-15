import type { Request, Response } from "express";
import { notifikasiService } from "./notifikasi.service.ts";

export const notifikasiController = {
  async create(req: Request, res: Response) {
    const notifikasi = await notifikasiService.create(req.body);

    res.status(201).json({
      message: "Notifikasi created successfully.",
      data: notifikasi,
    });
  },

  async getAll(req: Request, res: Response) {
    const { id_tiket } = req.query;

    if (typeof id_tiket === "string") {
      const data = await notifikasiService.getByTiketId(id_tiket);
      res.status(200).json({ data });
      return;
    }

    const data = await notifikasiService.getAll();
    res.status(200).json({ data });
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
};
