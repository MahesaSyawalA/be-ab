import { Router } from "express";
import { notifikasiController } from "./notifikasi.controller.ts";
import { createNotifikasiSchema, updateNotifikasiSchema } from "./notifikasi.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createNotifikasiSchema), notifikasiController.create);
router.get("/", notifikasiController.getAll);
router.patch("/read-all", notifikasiController.markAllAsRead);
router.get("/:id", notifikasiController.getById);
router.patch("/:id/read", notifikasiController.markAsRead);
router.put("/:id", validateBody(updateNotifikasiSchema), notifikasiController.update);
router.patch("/:id", validateBody(updateNotifikasiSchema), notifikasiController.update);
router.delete("/:id", notifikasiController.delete);

export default router;
