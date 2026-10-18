import type { Response } from "express";
import {
  COOKIE_NAMES,
  accessCookieClearOptions,
  accessCookieOptions,
  refreshCookieClearOptions,
  refreshCookieOptions,
} from "../../config/auth.ts";

export interface AuthCookieTokens {
  accessToken: string;
  refreshToken: string;
  /** Sisa umur sesi, dipakai agar Max-Age refresh cookie tidak melampaui SESSION_MAX_AGE. */
  refreshMaxAgeSec: number;
}

export function setAuthCookies(res: Response, tokens: AuthCookieTokens): void {
  res.cookie(COOKIE_NAMES.access, tokens.accessToken, accessCookieOptions());
  res.cookie(COOKIE_NAMES.refresh, tokens.refreshToken, refreshCookieOptions(tokens.refreshMaxAgeSec));
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(COOKIE_NAMES.access, accessCookieClearOptions());
  res.clearCookie(COOKIE_NAMES.refresh, refreshCookieClearOptions());
}
