import { Router } from "express";
import { aktivitasController } from "./aktivitas.controller.ts";
import { createAktivitasSchema } from "./aktivitas.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createAktivitasSchema), aktivitasController.create);
router.get("/", aktivitasController.getAll);
router.get("/:id", aktivitasController.getById);

export default router;
