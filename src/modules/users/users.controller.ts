import type { Request, Response } from "express";
import { userService } from "./users.service.ts";
import { userQuerySchema } from "./users.validation.ts";

export const usersController = {
    async create(req: Request, res: Response) {
        const user = await userService.create(req.body);

        res.status(201).json({
            message: "User created successfully.",
            data: user,
        });
    },

    async getAll(req: Request, res: Response) {
        const parsed = userQuerySchema.safeParse(req.query);

        if (!parsed.success) {
            res.status(400).json({
                message: parsed.error.issues[0]?.message ?? "Query tidak valid",
            });
            return;
        }

        const { page, limit, order, sort_by, ...filters } = parsed.data;

        const { data, meta } = await userService.getAll(
            filters,
            { page, limit, order },
            sort_by
        );

        res.status(200).json({ data, meta });
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

        res.status(200).json({ data: user });
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