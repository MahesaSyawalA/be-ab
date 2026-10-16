import { Router } from "express";
import { pelangganController } from "./pelanggan.controller.ts";
import { createPelangganSchema, updatePelangganSchema } from "./pelanggan.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createPelangganSchema), pelangganController.create);
router.get("/", pelangganController.getAll);
router.get("/:id", pelangganController.getById);
router.put("/:id", validateBody(updatePelangganSchema), pelangganController.update);
router.patch("/:id", validateBody(updatePelangganSchema), pelangganController.update);
router.delete("/:id", pelangganController.delete);

export default router;
