import type { Request, Response } from "express";
import { squadService } from "./squad.service.ts";

export const squadsController = {
  async create(req: Request, res: Response) {
    const squad = await squadService.create(req.body);

    res.status(201).json({
      message: "Squad created successfully.",
      data: squad,
    });
  },

  async getAll(_req: Request, res: Response) {
    const squads = await squadService.getAll();

    res.status(200).json({
      data: squads,
    });
  },
};
