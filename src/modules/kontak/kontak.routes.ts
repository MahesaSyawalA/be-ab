import { Router } from "express";
import { kontakController } from "./kontak.controller.ts";
import { createKontakSchema } from "./kontak.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createKontakSchema), kontakController.create);
router.get("/", kontakController.getAll);
router.get("/:id", kontakController.getById);

export default router;
