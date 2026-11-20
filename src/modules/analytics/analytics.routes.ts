import { Router } from "express";
import { analyticsController } from "./analytics.controller.ts";
import { requireRole } from "../../common/middleware/require-role.ts";

const router = Router();

router.use(requireRole("sales_manager", "director", "admin"));
router.get("/siklus-penjualan", analyticsController.siklusPenjualan);
router.get("/performa-sales", analyticsController.performaSales);
router.get("/top-spenders", analyticsController.topSpenders);

export default router;
