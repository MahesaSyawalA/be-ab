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
}

const PASSWORD = "rahasia123";

const ACCOUNTS: DummyAccount[] = [
  {
    nama: "Budi Sales",
    role: "sales",
    email: "sales@ab-medical.local",
    no_telp: "081200000001",
  },
  {
    nama: "Sari Manager",
    role: "sales_manager",
    email: "manager@ab-medical.local",
    no_telp: "081200000002",
  },
  {
    nama: "Dewi Director",
    role: "director",
    email: "director@ab-medical.local",
    no_telp: "081200000003",
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
      },
      create: {
        nama: account.nama,
        role: account.role,
        email: account.email,
        no_telp: account.no_telp,
        password_hash,
      },
    });

    console.log(`  ${user.role.padEnd(14)} ${user.email}  (id: ${user.id_user})`);
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
