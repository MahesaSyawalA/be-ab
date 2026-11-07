import type { Request, Response } from "express";
import { evidenceService } from "./evidence.service.ts";
import { evidenceQuerySchema } from "./evidence.validation.ts";

export const evidenceController = {
  async create(req: Request, res: Response) {
    const evidence = await evidenceService.create(req.body, req.file);

    res.status(201).json({
      message: "Evidence created successfully.",
      data: evidence,
    });
  },

  async getAll(req: Request, res: Response) {
    const parsed = evidenceQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Query tidak valid",
      });
      return;
    }

    const evidences = await evidenceService.getAll(parsed.data);

    res.status(200).json({
      data: evidences,
    });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const evidence = await evidenceService.getById(id);

    if (!evidence) {
      res.status(404).json({
        message: "Evidence not found.",
      });
      return;
    }

    res.status(200).json({
      data: evidence,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const evidence = await evidenceService.update(id, req.body, req.file);

    if (!evidence) {
      res.status(404).json({
        message: "Evidence not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Evidence updated successfully.",
      data: evidence,
    });
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await evidenceService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "Evidence not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Evidence deleted successfully.",
    });
  },
};