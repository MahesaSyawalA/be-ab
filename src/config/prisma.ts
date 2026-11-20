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

// Kolom uang bertipe DECIMAL di DB; ke luar tetap `number` agar JSON & tipe modul tidak berubah.
// shortcut: Number aman sampai 2^53 (~9 kuadriliun rupiah); agregasi (sum) wajib lewat `toNumber`.
const num = (d: { toNumber(): number }) => d.toNumber();
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    user: {
      biaya_bulanan: { needs: { biaya_bulanan: true }, compute: (r) => (r.biaya_bulanan ? num(r.biaya_bulanan) : null) },
    },
    tiket: { estimasi_nilai: { needs: { estimasi_nilai: true }, compute: (r) => num(r.estimasi_nilai) } },
    penawaran: { total_nilai: { needs: { total_nilai: true }, compute: (r) => num(r.total_nilai) } },
    purchaseOrder: {
      nilai_po: { needs: { nilai_po: true }, compute: (r) => num(r.nilai_po) },
      nilai_revenue: { needs: { nilai_revenue: true }, compute: (r) => num(r.nilai_revenue) },
    },
  },
});

export const prismaPool = pool;
