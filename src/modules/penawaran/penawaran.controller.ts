import type { Request, Response } from "express";
import { penawaranService } from "./penawaran.service.ts";

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
    const { id_tiket, id_aktivitas } = req.query;

    if (typeof id_tiket === "string") {
      const data = await penawaranService.getByTiketId(id_tiket);
      res.status(200).json({ data });
      return;
    }

    if (typeof id_aktivitas === "string") {
      const data = await penawaranService.getByAktivitasId(id_aktivitas);
      res.status(200).json({ data });
      return;
    }

    const data = await penawaranService.getAll();
    res.status(200).json({ data });
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
};
