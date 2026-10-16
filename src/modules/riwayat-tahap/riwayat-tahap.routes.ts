import { Router } from "express";
import { riwayatTahapController } from "./riwayat-tahap.controller.ts";
import { createRiwayatTahapSchema, updateRiwayatTahapSchema } from "./riwayat-tahap.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createRiwayatTahapSchema), riwayatTahapController.create);
router.get("/", riwayatTahapController.getAll);
router.get("/:id", riwayatTahapController.getById);
router.put("/:id", validateBody(updateRiwayatTahapSchema), riwayatTahapController.update);
router.patch("/:id", validateBody(updateRiwayatTahapSchema), riwayatTahapController.update);
router.delete("/:id", riwayatTahapController.delete);

export default router;
