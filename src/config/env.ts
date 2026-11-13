import "dotenv/config";
import { z } from "zod";

const DURATION_PATTERN = /^(\d+)(s|m|h|d)$/;

const UNIT_IN_SECONDS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
};

export function parseDuration(value: string, name: string): number {
  const match = DURATION_PATTERN.exec(value.trim());
  if (match === null) {
    throw new Error(`[env] ${name} must be formatted like "15m", "12h", or "7d". Received: "${value}".`);
  }

  const unit = match[2] ?? "";
  const multiplier = UNIT_IN_SECONDS[unit];

  if (multiplier === undefined) {
    throw new Error(`[env] ${name} uses an unrecognized time unit: "${value}".`);
  }

  return Number(match[1]) * multiplier;
}

const secretSchema = z
  .string()
  .min(64, "must be at least 64 characters (32 bytes in hex form)")
  .regex(/^[0-9a-fA-F]+$/, "must consist of hex characters")
  .refine((value) => !value.includes("<") && !value.includes(">"), "still contains a placeholder");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
  DATABASE_URL: z.string().min(1).default("mysql://root:@127.0.0.1:3306/salestracking_db"),

  CORS_ORIGINS: z.string().min(1).default("http://localhost:5173"),

  JWT_ACCESS_SECRET: secretSchema,
  JWT_REFRESH_SECRET: secretSchema,
  JWT_ISSUER: z.string().min(1).default("be-ab-medical"),
  JWT_AUDIENCE: z.string().min(1).default("ab-medical-web"),

  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL: z.string().default("7d"),
  SESSION_MAX_AGE: z.string().default("30d"),

  LOGIN_RATE_WINDOW: z.string().default("15m"),
  LOGIN_RATE_MAX: z.coerce.number().int().positive().default(10),

  BCRYPT_COST: z.coerce.number().int().min(10).max(15).default(12),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().default("no-reply@ab-medical.com"),
});

export interface Env {
  nodeEnv: "development" | "test" | "production";
  isProduction: boolean;
  port: number;
  trustProxy: number | false;
  databaseUrl: string;
  corsOrigins: string[];
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtIssuer: string;
  jwtAudience: string;
  accessTokenTtlSec: number;
  refreshTokenTtlSec: number;
  sessionMaxAgeSec: number;
  loginRateWindowSec: number;
  loginRateMax: number;
  bcryptCost: number;
  smtpHost: string | undefined;
  smtpPort: number;
  smtpUser: string | undefined;
  smtpPass: string | undefined;
  mailFrom: string;
}

export function validateEnv(raw: NodeJS.ProcessEnv): Env {
  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`[env] Environment configuration is invalid:\n${details}`);
  }

  const data = parsed.data;

  if (data.JWT_ACCESS_SECRET === data.JWT_REFRESH_SECRET) {
    throw new Error("[env] JWT_ACCESS_SECRET and JWT_REFRESH_SECRET cannot be the same.");
  }

  const accessTokenTtlSec = parseDuration(data.ACCESS_TOKEN_TTL, "ACCESS_TOKEN_TTL");
  const refreshTokenTtlSec = parseDuration(data.REFRESH_TOKEN_TTL, "REFRESH_TOKEN_TTL");
  const sessionMaxAgeSec = parseDuration(data.SESSION_MAX_AGE, "SESSION_MAX_AGE");

  if (accessTokenTtlSec >= refreshTokenTtlSec) {
    throw new Error("[env] ACCESS_TOKEN_TTL must be shorter than REFRESH_TOKEN_TTL.");
  }

  if (refreshTokenTtlSec > sessionMaxAgeSec) {
    throw new Error("[env] REFRESH_TOKEN_TTL cannot exceeds value of SESSION_MAX_AGE.");
  }

  const corsOrigins = data.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin !== "");

  if (corsOrigins.length === 0) {
    throw new Error("[env] CORS_ORIGIN must at least have one origin.");
  }

  return {
    nodeEnv: data.NODE_ENV,
    isProduction: data.NODE_ENV === "production",
    port: data.PORT,
    trustProxy: data.TRUST_PROXY === 0 ? false : data.TRUST_PROXY,
    databaseUrl: data.DATABASE_URL,
    corsOrigins,
    jwtAccessSecret: data.JWT_ACCESS_SECRET,
    jwtRefreshSecret: data.JWT_REFRESH_SECRET,
    jwtIssuer: data.JWT_ISSUER,
    jwtAudience: data.JWT_AUDIENCE,
    accessTokenTtlSec,
    refreshTokenTtlSec,
    sessionMaxAgeSec,
    loginRateWindowSec: parseDuration(data.LOGIN_RATE_WINDOW, "LOGIN_RATE_WINDOW"),
    loginRateMax: data.LOGIN_RATE_MAX,
    bcryptCost: data.BCRYPT_COST,
    smtpHost: data.SMTP_HOST,
    smtpPort: data.SMTP_PORT,
    smtpUser: data.SMTP_USER,
    smtpPass: data.SMTP_PASS,
    mailFrom: data.MAIL_FROM,
  };
}

export const env = validateEnv(process.env);