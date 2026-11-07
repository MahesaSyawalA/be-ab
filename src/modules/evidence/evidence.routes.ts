import { Router } from "express";
import { evidenceController } from "./evidence.controller.ts";
import { createEvidenceSchema, updateEvidenceSchema } from "./evidence.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";
import { uploadSingle } from "../../common/middleware/upload-file.ts";

const router = Router();

router.post("/", uploadSingle("file"), validateBody(createEvidenceSchema), evidenceController.create);
router.get("/", evidenceController.getAll);
router.get("/:id", evidenceController.getById);
router.put("/:id", uploadSingle("file"), validateBody(updateEvidenceSchema), evidenceController.update);
router.patch("/:id", uploadSingle("file"), validateBody(updateEvidenceSchema), evidenceController.update);
router.delete("/:id", evidenceController.delete);

export default router;