import { Router } from "express";
import { squadsController } from "./squad.controller.ts";
import { createSquadSchema, updateSquadSchema } from "./squad.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createSquadSchema), squadsController.create);
router.get("/", squadsController.getAll);
router.get("/:id", squadsController.getById);
router.put("/:id", validateBody(updateSquadSchema), squadsController.update);
router.patch("/:id", validateBody(updateSquadSchema), squadsController.update);
router.delete("/:id", squadsController.delete);

export default router;