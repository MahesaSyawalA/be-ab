export interface KondisiTiket {
  id_user: string;
  status: string;
  jenis_tahap: string;
}

export type KejadianTiket = "ditugaskan" | "po" | "revenue" | "lost";

/** Kejadian yang perlu dinotifikasi dari perubahan tiket; `sebelum` null berarti tiket baru. */
export function kejadianTiket(
  sebelum: KondisiTiket | null,
  sesudah: KondisiTiket,
): KejadianTiket[] {
  const hasil: KejadianTiket[] = [];
  if (sebelum?.id_user !== sesudah.id_user) hasil.push("ditugaskan");

  if (sesudah.status === "lost") {
    if (sebelum?.status !== "lost") hasil.push("lost");
  } else if (
    (sesudah.jenis_tahap === "po" || sesudah.jenis_tahap === "revenue") &&
    sebelum?.jenis_tahap !== sesudah.jenis_tahap
  ) {
    hasil.push(sesudah.jenis_tahap);
  }
  return hasil;
}
