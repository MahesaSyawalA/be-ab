import { Router } from "express";
import { tahapKanbanController } from "./tahap-kanban.controller.ts";
import { createTahapKanbanSchema, updateTahapKanbanSchema } from "./tahap-kanban.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createTahapKanbanSchema), tahapKanbanController.create);
router.get("/", tahapKanbanController.getAll);
router.get("/:id", tahapKanbanController.getById);
router.put("/:id", validateBody(updateTahapKanbanSchema), tahapKanbanController.update);
router.patch("/:id", validateBody(updateTahapKanbanSchema), tahapKanbanController.update);
router.delete("/:id", tahapKanbanController.delete);

export default router;
