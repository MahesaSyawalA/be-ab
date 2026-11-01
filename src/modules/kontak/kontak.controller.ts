import type { Request, Response } from "express";
import { kontakService } from "./kontak.service.ts";
import type { CreateKontakInput, UpdateKontakInput } from "./kontak.types.ts";

export const kontakController = {
  async create(req: Request, res: Response) {
    const data = req.body as CreateKontakInput;
    const kontak = await kontakService.create(data);

    res.status(201).json({
      message: "Kontak created successfully.",
      data: kontak,
    });
  },

  async getAll(req: Request, res: Response) {
    const { id_pelanggan } = req.query;

    if (typeof id_pelanggan === "string") {
      const data = await kontakService.getByPelangganId(id_pelanggan);
      res.status(200).json({ data });
      return;
    }

    const data = await kontakService.getAll();
    res.status(200).json({ data });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const kontak = await kontakService.getById(id);

    if (!kontak) {
      res.status(404).json({
        message: "Kontak not found.",
      });
      return;
    }

    res.status(200).json({
      data: kontak,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = req.body as UpdateKontakInput;
    const kontak = await kontakService.update(id, data);

    if (!kontak) {
      res.status(404).json({
        message: "Kontak not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Kontak updated successfully.",
      data: kontak,
    });
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await kontakService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "Kontak not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Kontak deleted successfully.",
    });
  },
};
