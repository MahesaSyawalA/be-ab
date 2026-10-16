import { Router } from "express";
import { penawaranController } from "./penawaran.controller.ts";
import { createPenawaranSchema, updatePenawaranSchema } from "./penawaran.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createPenawaranSchema), penawaranController.create);
router.get("/", penawaranController.getAll);
router.get("/:id", penawaranController.getById);
router.put("/:id", validateBody(updatePenawaranSchema), penawaranController.update);
router.patch("/:id", validateBody(updatePenawaranSchema), penawaranController.update);
router.delete("/:id", penawaranController.delete);

export default router;
