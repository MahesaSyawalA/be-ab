import type { UserRole } from "../users/users.types.ts";

/** Data user yang aman dikirim ke client (tanpa password_hash). */
export interface AuthUser {
  id_user: string;
  nama: string;
  role: UserRole;
  email: string;
  no_telp: string;
  id_squad: string | null;
  is_active: boolean;
  must_change_password: boolean;
}

/** Klaim yang disimpan di dalam access token. */
export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
  id_squad: string | null;
  token_version: number;
  type: "access";
}

/** Klaim yang disimpan di dalam refresh token. */
export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  token_version: number;
  /** Epoch detik saat login awal. Diwariskan apa adanya oleh /refresh. */
  auth_time: number;
  type: "refresh";
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  current_password: string;
  new_password: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
