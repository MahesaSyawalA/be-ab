import { Router } from "express";
import { tiketController } from "./tiket.controller.ts";
import { createTiketSchema, updateTiketSchema } from "./tiket.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createTiketSchema), tiketController.create);
router.get("/", tiketController.getAll);
router.get("/:id", tiketController.getById);
router.put("/:id", validateBody(updateTiketSchema), tiketController.update);
router.patch("/:id", validateBody(updateTiketSchema), tiketController.update);
router.delete("/:id", tiketController.delete);

export default router;
