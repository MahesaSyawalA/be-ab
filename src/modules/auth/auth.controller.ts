import type { Request, Response } from "express";
import { clearAuthCookies, setAuthCookies } from "../../common/utils/auth-cookies.ts";
import { parseCookies } from "../../common/utils/cookies.ts";
import { HttpError } from "../../common/utils/http-error.ts";
import { COOKIE_NAMES } from "../../config/auth.ts";
import { authService } from "./auth.service.ts";
import type { ChangePasswordInput, LoginInput, RefreshTokenPayload } from "./auth.types.ts";

const INVALID_SESSION_MESSAGE = "Sesi tidak valid atau sudah berakhir. Silakan login kembali.";

export const authController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body as LoginInput;

    const user = await authService.verifyCredentials(email, password);
    if (user === null) {
      throw new HttpError(401, "Email atau password salah.");
    }

    if (!user.is_active) {
      throw new HttpError(403, "Akun Anda dinonaktifkan. Hubungi administrator.");
    }

    const authTime = authService.nowInSeconds();

    setAuthCookies(res, {
      accessToken: await authService.signAccessToken(user),
      refreshToken: await authService.signRefreshToken(user, authTime),
      refreshMaxAgeSec: authService.refreshTokenMaxAgeSec(authTime),
    });

    res.status(200).json({
      message: "Login berhasil.",
      data: authService.toAuthUser(user),
    });
  },

  async refresh(req: Request, res: Response) {
    const token = parseCookies(req.headers.cookie)[COOKIE_NAMES.refresh];
    if (token === undefined) {
      clearAuthCookies(res);
      throw new HttpError(401, INVALID_SESSION_MESSAGE);
    }

    let payload: RefreshTokenPayload;
    try {
      payload = await authService.verifyRefreshToken(token);
    } catch (error) {
      clearAuthCookies(res);
      throw error;
    }

    // Data user diambil segar dari database, bukan dari klaim token.
    const user = await authService.getUserById(payload.sub);
    if (user === null || !user.is_active || user.token_version !== payload.token_version) {
      clearAuthCookies(res);
      throw new HttpError(401, INVALID_SESSION_MESSAGE);
    }

    // Rotasi: access + refresh token baru, `auth_time` diwariskan apa adanya.
    setAuthCookies(res, {
      accessToken: await authService.signAccessToken(user),
      refreshToken: await authService.signRefreshToken(user, payload.auth_time),
      refreshMaxAgeSec: authService.refreshTokenMaxAgeSec(payload.auth_time),
    });

    res.status(200).json({
      data: authService.toAuthUser(user),
    });
  },

  async logout(_req: Request, res: Response) {
    clearAuthCookies(res);

    res.status(200).json({
      message: "Logout berhasil.",
    });
  },

  async me(req: Request, res: Response) {
    const principal = req.user;
    if (principal === undefined) {
      clearAuthCookies(res);
      throw new HttpError(401, "Tidak terautentikasi.");
    }

    const user = await authService.getUserById(principal.sub);
    if (user === null || !user.is_active || user.token_version !== principal.token_version) {
      clearAuthCookies(res);
      throw new HttpError(401, INVALID_SESSION_MESSAGE);
    }

    res.status(200).json({
      data: authService.toAuthUser(user),
    });
  },

  async changePassword(req: Request, res: Response) {
    const principal = req.user;
    if (principal === undefined) {
      clearAuthCookies(res);
      throw new HttpError(401, "Tidak terautentikasi.");
    }
  
    const { current_password, new_password } = req.body as ChangePasswordInput;
  
    const updatedUser = await authService.changePassword(principal.sub, current_password, new_password);

    const authTime = authService.nowInSeconds();
    setAuthCookies(res, {
      accessToken: await authService.signAccessToken(updatedUser),
      refreshToken: await authService.signRefreshToken(updatedUser, authTime),
      refreshMaxAgeSec: authService.refreshTokenMaxAgeSec(authTime),
    });

    res.status(200).json({
      message: "Password berhasil diubah.",
      data: authService.toAuthUser(updatedUser),
    });
  },
};
