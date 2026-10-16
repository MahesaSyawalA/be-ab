import type { Request, Response } from "express";
import { userService } from "./users.service.ts";

export const usersController = {
  async create(req: Request, res: Response) {
    const user = await userService.create(req.body);

    res.status(201).json({
      message: "User created successfully.",
      data: user,
    });
  },

  async getAll(req: Request, res: Response) {
    const { id_squad } = req.query;

    if (typeof id_squad === "string") {
      const data = await userService.getBySquadId(id_squad);
      res.status(200).json({ data });
      return;
    }

    const users = await userService.getAll();

    res.status(200).json({
      data: users,
    });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const user = await userService.getById(id);

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      data: user,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const user = await userService.update(id, req.body);

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      message: "User updated successfully.",
      data: user,
    });
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await userService.delete(id);

    if (!deleted) {
      res.status(404).json({
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      message: "User deleted successfully.",
    });
  },
};
