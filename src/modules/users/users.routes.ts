import { Router } from "express";
import { usersController } from "./users.controller.ts";
import { createUserSchema, updateUserSchema } from "./users.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createUserSchema), usersController.create);
router.get("/", usersController.getAll);
router.get("/:id", usersController.getById);
router.put("/:id", validateBody(updateUserSchema), usersController.update);
router.patch("/:id", validateBody(updateUserSchema), usersController.update);
router.delete("/:id", usersController.delete);

export default router;
