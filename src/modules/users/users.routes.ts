import { Router } from "express";
import { usersController } from "./users.controller.ts";
import { createUserSchema } from "./users.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createUserSchema), usersController.create);
router.get("/", usersController.getAll);
router.get("/:id", usersController.getById);

export default router;
