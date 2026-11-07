import { Router } from "express";
import { pelangganController } from "./pelanggan.controller.ts";
import { createPelangganSchema, updatePelangganSchema } from "./pelanggan.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";
import { uploadSingle } from "../../common/middleware/upload-file.ts";

const router = Router();

router.post("/", uploadSingle("file"), validateBody(createPelangganSchema), pelangganController.create);
router.get("/", pelangganController.getAll);
router.get("/:id", pelangganController.getById);
router.put("/:id", uploadSingle("file"), validateBody(updatePelangganSchema), pelangganController.update);
router.patch("/:id", uploadSingle("file"), validateBody(updatePelangganSchema), pelangganController.update);
router.delete("/:id", pelangganController.delete);

export default router;
