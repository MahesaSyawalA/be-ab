import { Router } from "express";
import { buktiKunjunganController } from "./bukti-kunjungan.controller.ts";
import { createBuktiKunjunganSchema } from "./bukti-kunjungan.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createBuktiKunjunganSchema), buktiKunjunganController.create);
router.get("/", buktiKunjunganController.getAll);
router.get("/:id", buktiKunjunganController.getById);

export default router;
