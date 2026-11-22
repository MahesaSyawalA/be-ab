import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { requireAuth } from "../../common/middleware/require-auth.ts";
import { validateBody } from "../../common/middleware/validate-body.ts";
import { env } from "../../config/env.ts";
import { authController } from "./auth.controller.ts";
import { changePasswordSchema, loginSchema } from "./auth.validation.ts";

const loginLimiter = rateLimit({
  windowMs: env.loginRateWindowSec * 1000,
  limit: env.loginRateMax,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { message: "Terlalu banyak percobaan. Coba lagi nanti." },
});

const authActionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { message: "Terlalu banyak permintaan autentikasi. Coba lagi nanti." },
});

const router = Router();

router.post("/login", loginLimiter, validateBody(loginSchema), authController.login);
router.post("/refresh", authActionLimiter, authController.refresh);
router.post("/logout", authController.logout);
router.post(
  "/change-password",
  authActionLimiter,
  requireAuth,
  validateBody(changePasswordSchema),
  authController.changePassword,
);
router.get("/me", requireAuth, authController.me);

export default router;
