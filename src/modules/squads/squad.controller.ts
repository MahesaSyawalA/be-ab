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

  async getAll(req: Request, res: Response) {
    const { id_supervisor } = req.query;

    if (typeof id_supervisor === "string") {
      const data = await squadService.getBySupervisorId(id_supervisor);
      res.status(200).json({ data });
      return;
    }

    const squads = await squadService.getAll();

    res.status(200).json({
      data: squads,
    });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const squad = await squadService.getById(id);

    if (!squad) {
      res.status(404).json({
        message: "Squad not found.",
      });
      return;
    }

    res.status(200).json({
      data: squad,
    });
  },
};
