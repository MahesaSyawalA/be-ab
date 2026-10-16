import { Router } from "express";
import { purchaseOrderController } from "./purchase-order.controller.ts";
import { createPurchaseOrderSchema, updatePurchaseOrderSchema } from "./purchase-order.validation.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";

const router = Router();

router.post("/", validateBody(createPurchaseOrderSchema), purchaseOrderController.create);
router.get("/", purchaseOrderController.getAll);
router.get("/:id", purchaseOrderController.getById);
router.put("/:id", validateBody(updatePurchaseOrderSchema), purchaseOrderController.update);
router.patch("/:id", validateBody(updatePurchaseOrderSchema), purchaseOrderController.update);
router.delete("/:id", purchaseOrderController.delete);

export default router;
