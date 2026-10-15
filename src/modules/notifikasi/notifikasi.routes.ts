import { Router } from "express";
import { notifikasiController } from "./notifikasi.controller.ts";
import { createNotifikasiSchema } from "./notifikasi.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createNotifikasiSchema), notifikasiController.create);
router.get("/", notifikasiController.getAll);
router.get("/:id", notifikasiController.getById);
router.patch("/:id/read", notifikasiController.markAsRead);

export default router;
