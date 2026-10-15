import { Router } from "express";
import { pelangganController } from "./pelanggan.controller.ts";
import { createPelangganSchema } from "./pelanggan.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createPelangganSchema), pelangganController.create);
router.get("/", pelangganController.getAll);
router.get("/:id", pelangganController.getById);

export default router;
