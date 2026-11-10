import { Router } from "express";
import { usersController } from "./users.controller.ts";
import { createUserSchema, updateUserSchema } from "./users.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";
import { requireRole } from "../../common/middleware/require-role.ts";

const router = Router();

router.post("/", requireRole("director"), validateBody(createUserSchema), usersController.create);
router.get("/", usersController.getAll);
router.get("/:id", usersController.getById);
router.put("/:id", validateBody(updateUserSchema), usersController.update);
router.patch("/:id", validateBody(updateUserSchema), usersController.update);
router.delete("/:id", requireRole("director"), usersController.delete);

export default router;
