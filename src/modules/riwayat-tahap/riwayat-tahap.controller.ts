import type { Request, Response } from "express";
import { riwayatTahapService } from "./riwayat-tahap.service.ts";

export const riwayatTahapController = {
  async create(req: Request, res: Response) {
    const riwayat = await riwayatTahapService.create(req.body);

    res.status(201).json({
      message: "Riwayat Tahap created successfully.",
      data: riwayat,
    });
  },

  async getAll(req: Request, res: Response) {
    const { id_tiket } = req.query;

    if (typeof id_tiket === "string") {
      const data = await riwayatTahapService.getByTiketId(id_tiket);
      res.status(200).json({ data });
      return;
    }

    const data = await riwayatTahapService.getAll();
    res.status(200).json({ data });
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
