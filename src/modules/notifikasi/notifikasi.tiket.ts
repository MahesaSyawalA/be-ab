import { prisma } from "../../config/prisma.ts";
import { pusher } from "../../lib/pusher.ts";
import { kejadianTiket, type KejadianTiket, type KondisiTiket } from "./notifikasi.events.ts";

export const channelUser = (idUser: string) => `private-user-${idUser}`;

const JUDUL: Record<KejadianTiket, string> = {
  ditugaskan: "Tiket ditugaskan ke kamu",
  po: "Tiket masuk tahap PO",
  revenue: "Tiket masuk tahap Revenue",
  lost: "Tiket lost",
};

async function muatTiket(idTiket: string) {
  return prisma.tiket.findUnique({
    where: { id_tiket: idTiket },
    select: {
      id_user: true,
      status: true,
      judul: true,
      tahap: { select: { jenis_tahap: true } },
      pelanggan: { select: { nama_outlet: true } },
      user: { select: { nama: true, id_squad: true, squad: { select: { id_supervisor: true } } } },
    },
  });
}

/** Snapshot sebelum update, untuk dibandingkan setelahnya. */
export async function kondisiTiket(idTiket: string): Promise<KondisiTiket | null> {
  const t = await muatTiket(idTiket);
  return t ? { id_user: t.id_user, status: t.status, jenis_tahap: t.tahap.jenis_tahap } : null;
}

/** Simpan lalu kirim notifikasi. Kegagalan di sini tidak boleh menggagalkan operasi tiket. */
export async function notifikasiPerubahanTiket(
  idTiket: string,
  sebelum: KondisiTiket | null,
  idPelaku: string,
): Promise<void> {
  try {
    const t = await muatTiket(idTiket);
    if (!t) return;
    const kejadian = kejadianTiket(sebelum, {
      id_user: t.id_user,
      status: t.status,
      jenis_tahap: t.tahap.jenis_tahap,
    });

    for (const jenis of kejadian) {
      const supervisor = t.user.squad?.id_supervisor;
      const penerima = await prisma.user.findMany({
        where: {
          is_active: true,
          id_user: { not: idPelaku },
          ...(jenis === "ditugaskan"
            ? { AND: { id_user: t.id_user } }
            : {
                OR: [
                  { role: "director" },
                  ...(supervisor ? [{ id_user: supervisor }] : []),
                  ...(t.user.id_squad
                    ? [{ role: "sales_manager" as const, id_squad: t.user.id_squad }]
                    : []),
                ],
              }),
        },
        select: { id_user: true },
      });
      if (!penerima.length) continue;

      const title = JUDUL[jenis];
      const message = `${t.judul} · ${t.pelanggan.nama_outlet} (sales: ${t.user.nama})`;
      await prisma.notifikasi.createMany({
        data: penerima.map((p) => ({ id_user: p.id_user, id_tiket: idTiket, title, message })),
      });
      // Pusher membatasi 100 channel per trigger.
      for (let i = 0; i < penerima.length; i += 100) {
        await pusher.trigger(
          penerima.slice(i, i + 100).map((p) => channelUser(p.id_user)),
          "notifikasi-baru",
          { id_tiket: idTiket, title, message },
        );
      }
    }
  } catch (error) {
    console.error("Gagal mengirim notifikasi tiket:", error);
  }
}
