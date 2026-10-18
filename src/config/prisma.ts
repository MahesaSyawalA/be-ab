import { env } from "./env.ts";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mariadb, { type PoolConfig } from "mariadb";

function getPoolConfig(urlStr: string): PoolConfig {
  try {
    const parsed = new URL(urlStr);
    return {
      host: parsed.hostname === "localhost" ? "127.0.0.1" : (parsed.hostname || "127.0.0.1"),
      port: parsed.port ? Number(parsed.port) : 3306,
      user: parsed.username || "root",
      password: parsed.password || "",
      database: parsed.pathname ? parsed.pathname.replace(/^\//, "") : "salestracking_db",
      connectionLimit: 10,
    };
  } catch {
    return {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "",
      database: "salestracking_db",
      connectionLimit: 10,
    };
  }
}

const pool = mariadb.createPool(getPoolConfig(env.databaseUrl));
const adapter = new PrismaMariaDb(pool);

export const prisma = new PrismaClient({ adapter });

export const prismaPool = pool;
