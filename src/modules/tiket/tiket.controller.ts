import type { Request, Response } from "express";
import { tiketService } from "./tiket.service.ts";

export const tiketController = {
  async create(req: Request, res: Response) {
    const tiket = await tiketService.create(req.body);

    res.status(201).json({
      message: "Tiket created successfully.",
      data: tiket,
    });
  },

  async getAll(req: Request, res: Response) {
    const { id_pelanggan, id_user, id_tahap, id_kontak } = req.query;

    if (typeof id_pelanggan === "string") {
      const data = await tiketService.getByPelangganId(id_pelanggan);
      res.status(200).json({ data });
      return;
    }

    if (typeof id_user === "string") {
      const data = await tiketService.getByUserId(id_user);
      res.status(200).json({ data });
      return;
    }

    if (typeof id_tahap === "string") {
      const data = await tiketService.getByTahapId(id_tahap);
      res.status(200).json({ data });
      return;
    }

    if (typeof id_kontak === "string") {
      const data = await tiketService.getByKontakId(id_kontak);
      res.status(200).json({ data });
      return;
    }

    const data = await tiketService.getAll();
    res.status(200).json({ data });
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
