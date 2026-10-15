import type { Request, Response } from "express";
import { pelangganService } from "./pelanggan.service.ts";

export const pelangganController = {
  async create(req: Request, res: Response) {
    const pelanggan = await pelangganService.create(req.body);

    res.status(201).json({
      message: "Pelanggan created successfully.",
      data: pelanggan,
    });
  },

  async getAll(_req: Request, res: Response) {
    const data = await pelangganService.getAll();

    res.status(200).json({
      data,
    });
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
};
