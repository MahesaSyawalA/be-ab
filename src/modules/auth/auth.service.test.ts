import bcrypt from "bcryptjs";
import { SignJWT, decodeJwt } from "jose";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ACCESS_TOKEN_TTL_SEC,
  JWT_ALG,
  JWT_AUDIENCE,
  JWT_ISSUER,
  REFRESH_TOKEN_TTL_SEC,
  SESSION_MAX_AGE_SEC,
  accessTokenSecret,
  refreshTokenSecret,
} from "../../config/auth.ts";
import { parseDuration, validateEnv } from "../../config/env.ts";
import { HttpError } from "../../common/utils/http-error.ts";
import type { User } from "../users/users.types.ts";

vi.mock("./auth.repository.ts", () => ({
  authRepository: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
  },
}));

const { authRepository } = await import("./auth.repository.ts");
const { authService } = await import("./auth.service.ts");

const TEST_PASSWORD = "rahasia123";

function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function makeUser(passwordHash: string): User {
  return {
    id_user: "11111111-1111-1111-1111-111111111111",
    id_squad: null,
    nama: "Test User",
    role: "sales",
    email: "test@ab-medical.local",
    no_telp: "0800000000",
    password_hash: passwordHash,
    is_active: true,
    must_change_password: false,
    token_version: 0,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

async function expectUnauthorized(promise: Promise<unknown>): Promise<void> {
  await expect(promise).rejects.toBeInstanceOf(HttpError);
  await expect(promise).rejects.toMatchObject({ status: 401 });
}

describe("authService.verifyCredentials", () => {
  let user: User;

  beforeAll(async () => {
    user = makeUser(await bcrypt.hash(TEST_PASSWORD, 10));
  });

  beforeEach(() => {
    vi.mocked(authRepository.findByEmail).mockReset();
    vi.mocked(authRepository.findById).mockReset();
  });

  it("mengembalikan user bila password benar", async () => {
    vi.mocked(authRepository.findByEmail).mockResolvedValue(user);

    await expect(authService.verifyCredentials(user.email, TEST_PASSWORD)).resolves.toEqual(user);
  });

  it("mengembalikan null bila password salah", async () => {
    vi.mocked(authRepository.findByEmail).mockResolvedValue(user);

    await expect(authService.verifyCredentials(user.email, "password-salah")).resolves.toBeNull();
  });

  it("mengembalikan null bila email tidak ditemukan", async () => {
    vi.mocked(authRepository.findByEmail).mockResolvedValue(null);

    await expect(authService.verifyCredentials("tidak.ada@ab-medical.local", TEST_PASSWORD)).resolves.toBeNull();
  });

  it("tetap menjalankan bcrypt.compare saat email tidak ditemukan (anti timing attack)", async () => {
    vi.mocked(authRepository.findByEmail).mockResolvedValue(null);

    const startedAt = Date.now();
    await authService.verifyCredentials("tidak.ada@ab-medical.local", TEST_PASSWORD);
    const elapsed = Date.now() - startedAt;

    expect(elapsed).toBeGreaterThan(30);
  });

  it("toAuthUser membuang password_hash", () => {
    const authUser = authService.toAuthUser(user);

    expect(authUser).not.toHaveProperty("password_hash");
    expect(authUser).toMatchObject({
      id_user: user.id_user,
      email: user.email,
      role: user.role,
      id_squad: user.id_squad,
    });
  });
});

describe("authService access token", () => {
  let user: User;

  beforeAll(async () => {
    user = makeUser(await bcrypt.hash(TEST_PASSWORD, 10));
  });

  it("menerima token yang diterbitkan sendiri", async () => {
    const token = await authService.signAccessToken(user);

    await expect(authService.verifyAccessToken(token)).resolves.toMatchObject({
      sub: user.id_user,
      role: user.role,
      id_squad: user.id_squad,
      token_version: user.token_version,
      type: "access",
    });
  });

  it("menolak token expired", async () => {
    const issuedAt = nowInSeconds();
    const token = await new SignJWT({ role: "sales", id_squad: null, type: "access" })
      .setProtectedHeader({ alg: JWT_ALG })
      .setSubject(user.id_user)
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setIssuedAt(issuedAt - 3600)
      .setExpirationTime(issuedAt - 1800)
      .sign(accessTokenSecret);

    await expectUnauthorized(authService.verifyAccessToken(token));
  });

  it("menolak signature dari secret lain", async () => {
    const otherSecret = new TextEncoder().encode("x".repeat(64));
    const token = await new SignJWT({ role: "sales", id_squad: null, type: "access" })
      .setProtectedHeader({ alg: JWT_ALG })
      .setSubject(user.id_user)
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setIssuedAt(nowInSeconds())
      .setExpirationTime(nowInSeconds() + 900)
      .sign(otherSecret);

    await expectUnauthorized(authService.verifyAccessToken(token));
  });

  it("menolak refresh token yang dipakai sebagai access token", async () => {
    const token = await authService.signRefreshToken(user, nowInSeconds());

    await expectUnauthorized(authService.verifyAccessToken(token));
  });

  it("menolak issuer yang salah", async () => {
    const token = await new SignJWT({ role: "sales", id_squad: null, type: "access" })
      .setProtectedHeader({ alg: JWT_ALG })
      .setSubject(user.id_user)
      .setIssuer("issuer-palsu")
      .setAudience(JWT_AUDIENCE)
      .setIssuedAt(nowInSeconds())
      .setExpirationTime(nowInSeconds() + 900)
      .sign(accessTokenSecret);

    await expectUnauthorized(authService.verifyAccessToken(token));
  });

  it("menolak audience yang salah", async () => {
    const token = await new SignJWT({ role: "sales", id_squad: null, type: "access" })
      .setProtectedHeader({ alg: JWT_ALG })
      .setSubject(user.id_user)
      .setIssuer(JWT_ISSUER)
      .setAudience("audience-palsu")
      .setIssuedAt(nowInSeconds())
      .setExpirationTime(nowInSeconds() + 900)
      .sign(accessTokenSecret);

    await expectUnauthorized(authService.verifyAccessToken(token));
  });

  it("menolak algoritma selain HS256", async () => {
    const token = await new SignJWT({ role: "sales", id_squad: null, type: "access" })
      .setProtectedHeader({ alg: "HS512" })
      .setSubject(user.id_user)
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setIssuedAt(nowInSeconds())
      .setExpirationTime(nowInSeconds() + 900)
      .sign(accessTokenSecret);

    await expectUnauthorized(authService.verifyAccessToken(token));
  });

  it("menolak role yang tidak dikenal", async () => {
    const token = await new SignJWT({ role: "superadmin", id_squad: null, type: "access" })
      .setProtectedHeader({ alg: JWT_ALG })
      .setSubject(user.id_user)
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setIssuedAt(nowInSeconds())
      .setExpirationTime(nowInSeconds() + 900)
      .sign(accessTokenSecret);

    await expectUnauthorized(authService.verifyAccessToken(token));
  });

  it("exp access token = iat + ACCESS_TOKEN_TTL", async () => {
    const token = await authService.signAccessToken(user);
    const payload = decodeJwt(token);

    expect(payload.exp).toBe((payload.iat ?? 0) + ACCESS_TOKEN_TTL_SEC);
    expect(payload.jti).toBeTruthy();
  });
});

describe("authService refresh token", () => {
  let user: User;

  beforeAll(async () => {
    user = makeUser(await bcrypt.hash(TEST_PASSWORD, 10));
  });

  it("menerima token yang diterbitkan sendiri", async () => {
    const authTime = nowInSeconds();
    const token = await authService.signRefreshToken(user, authTime);

    await expect(authService.verifyRefreshToken(token)).resolves.toMatchObject({
      sub: user.id_user,
      auth_time: authTime,
      token_version: user.token_version,
      type: "refresh",
    });
  });

  it("menolak access token yang dipakai sebagai refresh token", async () => {
    const token = await authService.signAccessToken(user);

    await expectUnauthorized(authService.verifyRefreshToken(token));
  });

  it("menolak token expired", async () => {
    const issuedAt = nowInSeconds();
    const token = await new SignJWT({ type: "refresh", auth_time: issuedAt - 3600 })
      .setProtectedHeader({ alg: JWT_ALG })
      .setSubject(user.id_user)
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setIssuedAt(issuedAt - 3600)
      .setExpirationTime(issuedAt - 1800)
      .sign(refreshTokenSecret);

    await expectUnauthorized(authService.verifyRefreshToken(token));
  });

  it("menolak sesi yang melewati SESSION_MAX_AGE walau token belum expired", async () => {
    const issuedAt = nowInSeconds();
    const staleAuthTime = issuedAt - SESSION_MAX_AGE_SEC - 60;

    const token = await new SignJWT({ type: "refresh", auth_time: staleAuthTime })
      .setProtectedHeader({ alg: JWT_ALG })
      .setSubject(user.id_user)
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setIssuedAt(issuedAt)
      .setExpirationTime(issuedAt + 3600)
      .sign(refreshTokenSecret);

    await expectUnauthorized(authService.verifyRefreshToken(token));
  });

  it("rotasi mewariskan auth_time apa adanya dan tidak melampaui SESSION_MAX_AGE", async () => {
    const authTime = nowInSeconds();
    const rotatedToken = await authService.signRefreshToken(user, authTime);
    const payload = decodeJwt(rotatedToken);

    expect(payload.auth_time).toBe(authTime);
    // REFRESH_TOKEN_TTL (7d) lebih pendek dari SESSION_MAX_AGE (30d),
    // jadi exp dihitung dari iat + REFRESH_TOKEN_TTL.
    expect(payload.exp).toBe((payload.iat ?? 0) + REFRESH_TOKEN_TTL_SEC);
    expect(payload.exp).toBeLessThanOrEqual(authTime + SESSION_MAX_AGE_SEC);
  });

  it("refreshTokenMaxAgeSec tidak melebihi sisa umur sesi", () => {
    const authTime = nowInSeconds();
    const maxAge = authService.refreshTokenMaxAgeSec(authTime);

    expect(maxAge).toBeGreaterThan(0);
    expect(maxAge).toBeLessThanOrEqual(authTime + SESSION_MAX_AGE_SEC - nowInSeconds());
  });
});

describe("parseDuration", () => {
  it("mengubah satuan menjadi detik", () => {
    expect(parseDuration("30s", "X")).toBe(30);
    expect(parseDuration("15m", "X")).toBe(900);
    expect(parseDuration("2h", "X")).toBe(7200);
    expect(parseDuration("7d", "X")).toBe(604800);
  });

  it("menolak format yang tidak dikenal", () => {
    expect(() => parseDuration("15", "X")).toThrow();
    expect(() => parseDuration("15ms", "X")).toThrow();
    expect(() => parseDuration("", "X")).toThrow();
  });
});

describe("validateEnv", () => {
  const validRaw = (): NodeJS.ProcessEnv => ({
    NODE_ENV: "test",
    PORT: "3000",
    TRUST_PROXY: "0",
    DATABASE_URL: "mysql://root:@127.0.0.1:3306/test",
    CORS_ORIGIN: "http://localhost:5173",
    JWT_ACCESS_SECRET: "a".repeat(64),
    JWT_REFRESH_SECRET: "b".repeat(64),
    JWT_ISSUER: "issuer",
    JWT_AUDIENCE: "audience",
    ACCESS_TOKEN_TTL: "15m",
    REFRESH_TOKEN_TTL: "7d",
    SESSION_MAX_AGE: "30d",
    LOGIN_RATE_WINDOW: "15m",
    LOGIN_RATE_MAX: "10",
    BCRYPT_COST: "10",
  });

  it("menerima konfigurasi yang valid", () => {
    const env = validateEnv(validRaw());

    expect(env.accessTokenTtlSec).toBe(900);
    expect(env.refreshTokenTtlSec).toBe(604800);
    expect(env.sessionMaxAgeSec).toBe(2592000);
    expect(env.trustProxy).toBe(false);
    expect(env.corsOrigins).toEqual(["http://localhost:5173"]);
  });

  it("menolak secret yang terlalu pendek", () => {
    expect(() => validateEnv({ ...validRaw(), JWT_ACCESS_SECRET: "abc" })).toThrow(/JWT_ACCESS_SECRET/);
  });

  it("menolak secret yang bukan hex", () => {
    expect(() => validateEnv({ ...validRaw(), JWT_REFRESH_SECRET: "z".repeat(64) })).toThrow(/JWT_REFRESH_SECRET/);
  });

  it("menolak placeholder", () => {
    const placeholder = `<random-32-byte>`.padEnd(64, "x");

    expect(() => validateEnv({ ...validRaw(), JWT_ACCESS_SECRET: placeholder })).toThrow(/placeholder/);
  });

  it("menolak access dan refresh secret yang sama", () => {
    expect(() =>
      validateEnv({ ...validRaw(), JWT_REFRESH_SECRET: "a".repeat(64) })
    ).toThrow(/cannot be the same|tidak boleh sama/i);
  });

  it("menolak TTL dengan format salah", () => {
    expect(() => validateEnv({ ...validRaw(), ACCESS_TOKEN_TTL: "15" })).toThrow(/ACCESS_TOKEN_TTL/);
  });

  it("menolak ACCESS_TOKEN_TTL yang tidak lebih pendek dari refresh", () => {
    expect(() => validateEnv({ ...validRaw(), ACCESS_TOKEN_TTL: "8d" })).toThrow(/shorter|lebih pendek/i);
  });

  it("menolak REFRESH_TOKEN_TTL yang melebihi SESSION_MAX_AGE", () => {
    expect(() => validateEnv({ ...validRaw(), SESSION_MAX_AGE: "1d" })).toThrow(/SESSION_MAX_AGE/);
  });

  it("menolak secret yang hilang", () => {
    const raw = validRaw();
    delete raw.JWT_ACCESS_SECRET;

    expect(() => validateEnv(raw)).toThrow(/JWT_ACCESS_SECRET/);
  });
});
