import { Router } from "express";
import { kontakController } from "./kontak.controller.ts";
import { createKontakSchema, updateKontakSchema } from "./kontak.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createKontakSchema), kontakController.create);
router.get("/", kontakController.getAll);
router.get("/:id", kontakController.getById);
router.put("/:id", validateBody(updateKontakSchema), kontakController.update);
router.patch("/:id", validateBody(updateKontakSchema), kontakController.update);
router.delete("/:id", kontakController.delete);

export default router;
