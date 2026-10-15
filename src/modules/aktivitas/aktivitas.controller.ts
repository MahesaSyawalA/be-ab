import type { Request, Response } from "express";
import { aktivitasService } from "./aktivitas.service.ts";

export const aktivitasController = {
  async create(req: Request, res: Response) {
    const aktivitas = await aktivitasService.create(req.body);

    res.status(201).json({
      message: "Aktivitas created successfully.",
      data: aktivitas,
    });
  },

  async getAll(req: Request, res: Response) {
    const { id_user, id_tiket } = req.query;

    if (typeof id_user === "string") {
      const data = await aktivitasService.getByUserId(id_user);
      res.status(200).json({ data });
      return;
    }

    if (typeof id_tiket === "string") {
      const data = await aktivitasService.getByTiketId(id_tiket);
      res.status(200).json({ data });
      return;
    }

    const data = await aktivitasService.getAll();
    res.status(200).json({ data });
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
};
