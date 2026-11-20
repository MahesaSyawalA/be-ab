import { Router } from "express";
import { prisma } from "../config/prisma.ts";

const router = Router();

router.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "API is running",
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    },
  });
});

router.get("/health/query", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      success: true,
      message: "API is ready (Query & Database)",
      data: {
        status: "ready",
        database: `connected (${process.env.DATABASE_PROVIDER})`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[health/query] database check failed:", error);
    return res.status(503).json({
      success: false,
      message: "API is not ready",
      data: {
        status: "unavailable",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export default router;