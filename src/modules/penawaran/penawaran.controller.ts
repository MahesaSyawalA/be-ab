import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../../common/utils/http-error.ts";
import { penawaranService } from "./penawaran.service.ts";
import { penawaranQuerySchema } from "./penawaran.validation.ts";

function handleWriteError(error: unknown, next: NextFunction, res: Response, conflictMessage: string) {
  if (error instanceof HttpError) {
    next(error);
    return;
  }
  const code = (error as { code?: string })?.code;
  if (code === "P2002") {
    res.status(409).json({ message: conflictMessage });
    return;
  }
  next(error);
}

export const penawaranController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const penawaran = await penawaranService.create(req.body);

      res.status(201).json({
        message: "Penawaran created successfully.",
        data: penawaran,
      });
    } catch (error: unknown) {
      handleWriteError(error, next, res, "Nomor penawaran sudah digunakan.");
    }
  },

  async getAll(req: Request, res: Response) {
    const parsed = penawaranQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Query tidak valid",
      });
      return;
    }

    const { page, limit, order, ...filters } = parsed.data;
    const { data, meta } = await penawaranService.getAll(filters, { page, limit, order });

    res.status(200).json({ data, meta });
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

  async update(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    try {
      const penawaran = await penawaranService.update(id, req.body);

      if (!penawaran) {
        res.status(404).json({
          message: "Penawaran not found.",
        });
        return;
      }

      res.status(200).json({
        message: "Penawaran updated successfully.",
        data: penawaran,
      });
    } catch (error: unknown) {
      handleWriteError(error, next, res, "Nomor penawaran sudah digunakan.");
    }
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await penawaranService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "Penawaran not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Penawaran deleted successfully.",
    });
  },
};