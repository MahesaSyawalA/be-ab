import { Router } from "express";
import { buktiKunjunganController } from "./bukti-kunjungan.controller.ts";
import { createBuktiKunjunganSchema, updateBuktiKunjunganSchema } from "./bukti-kunjungan.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";
import { buktiKunjunganUpload } from "./bukti-kunjungan.upload.ts";

const router = Router();

router.get("/", buktiKunjunganController.getAll);
router.get("/:id", buktiKunjunganController.getById);
router.delete("/:id", buktiKunjunganController.delete);
router.patch("/:id", buktiKunjunganUpload, validateBody(updateBuktiKunjunganSchema, { requireBodyOrFile: true }), buktiKunjunganController.update);
router.post("/", buktiKunjunganUpload, validateBody(createBuktiKunjunganSchema), buktiKunjunganController.create);
router.put("/:id", buktiKunjunganUpload, validateBody(updateBuktiKunjunganSchema, { requireBodyOrFile: true }), buktiKunjunganController.update);

export default router;
