import { Router } from "express";
import { usersController } from "./users.controller.ts";
import { createUserSchema, updateUserSchema } from "./users.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";
import { requireRole } from "../../common/middleware/require-role.ts";

const router = Router();

router.post("/", requireRole("director"), validateBody(createUserSchema), usersController.create);
router.get("/", usersController.getAll);
router.get("/:id", usersController.getById);
router.put("/:id", requireRole("director"), validateBody(updateUserSchema), usersController.update);
router.patch("/:id", requireRole("director"), validateBody(updateUserSchema), usersController.update);
router.post("/:id/reset-password", requireRole("director"), usersController.resetPassword);
router.delete("/:id", requireRole("director"), usersController.delete);

export default router;
