import { Router } from "express";
import { squadsController } from "./squad.controller.ts";
import { createSquadSchema } from "./squad.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createSquadSchema), squadsController.create);
router.get("/", squadsController.getAll);
router.get("/:id", squadsController.getById);

export default router;