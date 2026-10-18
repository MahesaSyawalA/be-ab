import type { CookieOptions } from "express";
import { env } from "./env.ts";

export const JWT_ALG = "HS256";
export const JWT_ISSUER = env.jwtIssuer;
export const JWT_AUDIENCE = env.jwtAudience;

export const accessTokenSecret = new TextEncoder().encode(env.jwtAccessSecret);
export const refreshTokenSecret = new TextEncoder().encode(env.jwtRefreshSecret);

export const ACCESS_TOKEN_TTL_SEC = env.accessTokenTtlSec;
export const REFRESH_TOKEN_TTL_SEC = env.refreshTokenTtlSec;
export const SESSION_MAX_AGE_SEC = env.sessionMaxAgeSec;

export const BCRYPT_COST = env.bcryptCost;

export const COOKIE_NAMES = {
  access: "access_token",
  refresh: "refresh_token",
} as const;

/** Refresh token hanya dikirim browser ke endpoint auth. */
export const REFRESH_COOKIE_PATH = "/api/auth";

// Cookie dibuat host-only (tanpa atribut `Domain`) — paling aman dan tetap
// bekerja di localhost.
function baseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
  };
}

export function accessCookieOptions(): CookieOptions {
  return {
    ...baseCookieOptions(),
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_SEC * 1000,
  };
}

/** `maxAgeSec` dibatasi sisa umur sesi absolut, jadi tidak selalu penuh REFRESH_TOKEN_TTL. */
export function refreshCookieOptions(maxAgeSec: number): CookieOptions {
  return {
    ...baseCookieOptions(),
    path: REFRESH_COOKIE_PATH,
    maxAge: maxAgeSec * 1000,
  };
}

// Saat menghapus cookie, `maxAge` tidak boleh disertakan: browser memprioritaskan
// Max-Age di atas Expires sehingga cookie tidak akan benar-benar terhapus.
export function accessCookieClearOptions(): CookieOptions {
  return {
    ...baseCookieOptions(),
    path: "/",
  };
}

export function refreshCookieClearOptions(): CookieOptions {
  return {
    ...baseCookieOptions(),
    path: REFRESH_COOKIE_PATH,
  };
}
