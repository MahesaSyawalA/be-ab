/**
 * Seed akun dummy untuk pengujian. Idempoten — aman dijalankan berulang kali
 * karena memakai `upsert` berdasarkan email.
 *
 * Jalankan: npm run seed
 */
import bcrypt from "bcryptjs";
import { BCRYPT_COST } from "../src/config/auth.ts";
import { prisma, prismaPool } from "../src/config/prisma.ts";
import type { UserRole } from "../src/modules/users/users.types.ts";

interface DummyAccount {
  nama: string;
  role: UserRole;
  email: string;
  no_telp: string;
  is_active?: boolean;
  must_change_password?: boolean;
}

const PASSWORD = "rahasia123";

const ACCOUNTS: DummyAccount[] = [
  {
    nama: "Admin System",
    role: "admin",
    email: "admin@ab-medical.local",
    no_telp: "081200000000",
    is_active: true,
    must_change_password: false,
  },
  {
    nama: "Budi Sales",
    role: "sales",
    email: "sales@ab-medical.local",
    no_telp: "081200000001",
    is_active: true,
    must_change_password: false,
  },
  {
    nama: "Sari Manager",
    role: "sales_manager",
    email: "manager@ab-medical.local",
    no_telp: "081200000002",
    is_active: true,
    must_change_password: false,
  },
  {
    nama: "Dewi Director",
    role: "director",
    email: "director@ab-medical.local",
    no_telp: "081200000003",
    is_active: true,
    must_change_password: false,
  },
  {
    nama: "Joko Nonaktif",
    role: "sales",
    email: "nonaktif@ab-medical.local",
    no_telp: "081200000004",
    is_active: false,
    must_change_password: false,
  },
  {
    nama: "Rudi Reset Password",
    role: "sales",
    email: "reset@ab-medical.local",
    no_telp: "081200000005",
    is_active: true,
    must_change_password: true,
  },
];

async function main(): Promise<void> {
  const password_hash = await bcrypt.hash(PASSWORD, BCRYPT_COST);

  console.log(`bcrypt cost: ${BCRYPT_COST}`);
  console.log("");

  for (const account of ACCOUNTS) {
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        nama: account.nama,
        role: account.role,
        no_telp: account.no_telp,
        password_hash,
        is_active: account.is_active ?? true,
        must_change_password: account.must_change_password ?? false,
      },
      create: {
        nama: account.nama,
        role: account.role,
        email: account.email,
        no_telp: account.no_telp,
        password_hash,
        is_active: account.is_active ?? true,
        must_change_password: account.must_change_password ?? false,
      },
    });

    const statusStr = user.is_active ? "[AKTIF]" : "[NONAKTIF]";
    const flagStr = user.must_change_password ? "(must change pwd)" : "";
    console.log(`  ${user.role.padEnd(14)} ${user.email.padEnd(30)} ${statusStr.padEnd(12)} ${flagStr} (id: ${user.id_user})`);
  }

  console.log("");
  console.log(`Semua akun memakai password: ${PASSWORD}`);
}

main()
  .catch((error: unknown) => {
    console.error("Gagal menjalankan seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await prismaPool.end();
  });
