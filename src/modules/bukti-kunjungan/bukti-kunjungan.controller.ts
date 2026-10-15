import type { Request, Response } from "express";
import { buktiKunjunganService } from "./bukti-kunjungan.service.ts";

export const buktiKunjunganController = {
  async create(req: Request, res: Response) {
    const bukti = await buktiKunjunganService.create(req.body);

    res.status(201).json({
      message: "Bukti Kunjungan created successfully.",
      data: bukti,
    });
  },

  async getAll(req: Request, res: Response) {
    const { id_aktivitas } = req.query;

    if (typeof id_aktivitas === "string") {
      const data = await buktiKunjunganService.getByAktivitasId(id_aktivitas);
      res.status(200).json({ data });
      return;
    }

    const data = await buktiKunjunganService.getAll();
    res.status(200).json({ data });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const bukti = await buktiKunjunganService.getById(id);

    if (!bukti) {
      res.status(404).json({
        message: "Bukti Kunjungan not found.",
      });
      return;
    }

    res.status(200).json({
      data: bukti,
    });
  },
};
