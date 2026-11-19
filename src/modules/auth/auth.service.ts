import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { HttpError } from "../../common/utils/http-error.ts";
import {
  ACCESS_TOKEN_TTL_SEC,
  BCRYPT_COST,
  JWT_ALG,
  JWT_AUDIENCE,
  JWT_ISSUER,
  REFRESH_TOKEN_TTL_SEC,
  SESSION_MAX_AGE_SEC,
  accessTokenSecret,
  refreshTokenSecret,
} from "../../config/auth.ts";
import type { User, UserRole } from "../users/users.types.ts";
import { authRepository } from "./auth.repository.ts";
import type { AccessTokenPayload, AuthUser, RefreshTokenPayload } from "./auth.types.ts";

const USER_ROLES: readonly UserRole[] = ["sales", "sales_manager", "director", "admin"];

const INVALID_SESSION_MESSAGE = "Sesi tidak valid atau sudah berakhir. Silakan login kembali.";

/**
 * Hash palsu dengan cost yang sama. `verifyCredentials` selalu memanggil
 * `bcrypt.compare` walau email tidak ditemukan, sehingga waktu respons tidak
 * membocorkan keberadaan akun.
 */
const DUMMY_HASH = bcrypt.hashSync("ab-medical-dummy-password", BCRYPT_COST);

const VERIFY_OPTIONS = {
  algorithms: [JWT_ALG],
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
};

type AccessTokenSubject = Pick<User, "id_user" | "role" | "id_squad" | "token_version">;

function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole);
}

function readStringClaim(payload: JWTPayload, key: string): string | null {
  const value = payload[key];
  return typeof value === "string" ? value : null;
}

export const authService = {
  /** Selalu menjalankan bcrypt.compare, walau user tidak ditemukan (anti timing attack). */
  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const user = await authRepository.findByEmail(email);
    const passwordMatches = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);

    if (user === null || !passwordMatches) return null;
    return user;
  },

  toAuthUser(user: User): AuthUser {
    return {
      id_user: user.id_user,
      nama: user.nama,
      role: user.role,
      email: user.email,
      id_squad: user.id_squad,
    };
  },

  async getUserById(idUser: string): Promise<User | null> {
    return authRepository.findById(idUser);
  },

  /** Waktu login awal, diisi di /login dan diwariskan apa adanya oleh /refresh. */
  nowInSeconds,

  async signAccessToken(user: AccessTokenSubject): Promise<string> {
    const issuedAt = nowInSeconds();

    return new SignJWT({
      role: user.role,
      id_squad: user.id_squad,
      token_version: user.token_version ?? 0,
      type: "access",
    })
      .setProtectedHeader({ alg: JWT_ALG })
      .setSubject(user.id_user)
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setJti(randomUUID())
      .setIssuedAt(issuedAt)
      .setExpirationTime(issuedAt + ACCESS_TOKEN_TTL_SEC)
      .sign(accessTokenSecret);
  },

  /**
   * `exp` refresh token dibatasi `auth_time + SESSION_MAX_AGE`, sehingga rotasi
   * tidak bisa memperpanjang sesi tanpa batas.
   */
  async signRefreshToken(user: Pick<User, "id_user" | "token_version">, authTime: number): Promise<string> {
    const issuedAt = nowInSeconds();
    const expiresAt = Math.min(issuedAt + REFRESH_TOKEN_TTL_SEC, authTime + SESSION_MAX_AGE_SEC);

    return new SignJWT({
      type: "refresh",
      auth_time: authTime,
      token_version: user.token_version ?? 0,
    })
      .setProtectedHeader({ alg: JWT_ALG })
      .setSubject(user.id_user)
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setJti(randomUUID())
      .setIssuedAt(issuedAt)
      .setExpirationTime(expiresAt)
      .sign(refreshTokenSecret);
  },

  /** Sisa umur sesi dalam detik, dipakai sebagai Max-Age cookie refresh. */
  refreshTokenMaxAgeSec(authTime: number): number {
    const now = nowInSeconds();
    const expiresAt = Math.min(now + REFRESH_TOKEN_TTL_SEC, authTime + SESSION_MAX_AGE_SEC);
    return Math.max(0, expiresAt - now);
  },

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      const { payload } = await jwtVerify(token, accessTokenSecret, VERIFY_OPTIONS);

      const sub = payload.sub;
      const role = payload.role;
      const tokenVersion = typeof payload.token_version === "number" ? payload.token_version : 0;

      if (payload.type !== "access" || typeof sub !== "string" || !isUserRole(role)) {
        throw new Error("Klaim access token tidak lengkap.");
      }

      return {
        sub,
        role,
        id_squad: readStringClaim(payload, "id_squad"),
        token_version: tokenVersion,
        type: "access",
      };
    } catch {
      throw new HttpError(401, INVALID_SESSION_MESSAGE);
    }
  },

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      const { payload } = await jwtVerify(token, refreshTokenSecret, VERIFY_OPTIONS);

      const sub = payload.sub;
      const authTime = payload.auth_time;
      const tokenVersion = typeof payload.token_version === "number" ? payload.token_version : 0;

      if (payload.type !== "refresh" || typeof sub !== "string" || typeof authTime !== "number") {
        throw new Error("Klaim refresh token tidak lengkap.");
      }

      if (nowInSeconds() - authTime > SESSION_MAX_AGE_SEC) {
        throw new Error("Sesi melewati batas umur absolut.");
      }

      return {
        sub,
        jti: readStringClaim(payload, "jti") ?? "",
        auth_time: authTime,
        token_version: tokenVersion,
        type: "refresh",
      };
    } catch {
      throw new HttpError(401, INVALID_SESSION_MESSAGE);
    }
  },

  async changePassword(idUser: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await authRepository.findById(idUser);
    if (user === null) throw new HttpError(401, INVALID_SESSION_MESSAGE);
    
    const passwordMatches = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatches) throw new HttpError(400, "Password saat ini tidak sesuai");
    
    const isSameAsOld = await bcrypt.compare(newPassword, user.password_hash);
    if (isSameAsOld) throw new HttpError(400, "Password baru tidak boleh sama dengan password saat ini");
    
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_COST);
    
    await authRepository.updatePassword(idUser, {
      password_hash: passwordHash,
      must_change_password: false,
    });
  },
};
