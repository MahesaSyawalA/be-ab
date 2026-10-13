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

  async getAll(_req: Request, res: Response) {
    const users = await userService.getAll();

    res.status(200).json({
      data: users,
    });
  },
};
