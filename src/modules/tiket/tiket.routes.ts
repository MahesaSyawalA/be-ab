import { Router } from "express";
import { tiketController } from "./tiket.controller.ts";
import { createTiketSchema } from "./tiket.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createTiketSchema), tiketController.create);
router.get("/", tiketController.getAll);
router.get("/:id", tiketController.getById);

export default router;
