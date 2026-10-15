import { Router } from "express";
import { riwayatTahapController } from "./riwayat-tahap.controller.ts";
import { createRiwayatTahapSchema } from "./riwayat-tahap.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createRiwayatTahapSchema), riwayatTahapController.create);
router.get("/", riwayatTahapController.getAll);
router.get("/:id", riwayatTahapController.getById);

export default router;
