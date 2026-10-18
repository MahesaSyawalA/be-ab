/**
 * Migrasi satu kali: mengubah `password_hash` yang masih berisi password polos
 * menjadi hash bcrypt.
 *
 * Deteksi: hash bcrypt selalu diawali `$2` (mis. `$2b$12$...`). Nilai yang tidak
 * diawali `$2` dianggap password polos.
 *
 * Jalankan: npm run rehash-passwords
 */
import bcrypt from "bcryptjs";
import { BCRYPT_COST } from "../src/config/auth.ts";
import { prisma, prismaPool } from "../src/config/prisma.ts";

async function main(): Promise<void> {
  const users = await prisma.user.findMany();

  const plaintextUsers = users.filter((user) => !user.password_hash.startsWith("$2"));

  console.log(`Total user: ${users.length}`);
  console.log(`Perlu di-hash: ${plaintextUsers.length}`);

  for (const user of plaintextUsers) {
    const password_hash = await bcrypt.hash(user.password_hash, BCRYPT_COST);

    await prisma.user.update({
      where: { id_user: user.id_user },
      data: { password_hash },
    });

    console.log(`  rehash: ${user.email}`);
  }

  console.log("Selesai.");
}

main()
  .catch((error: unknown) => {
    console.error("Gagal menjalankan rehash:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await prismaPool.end();
  });
