export interface StageEvent {
  jenis_tahap: string;
  waktu_pindah: Date | string;
}

const MS_PER_DAY = 86_400_000;

function earliest(events: StageEvent[], jenis: string): Date | null {
  const times = events.filter((e) => e.jenis_tahap === jenis).map((e) => new Date(e.waktu_pindah).getTime());
  return times.length ? new Date(Math.min(...times)) : null;
}

/**
 * Durasi siklus penjualan (hari): masuk tahap berjenis `quotation` pertama kali sampai
 * masuk tahap berjenis `revenue` pertama kali. Dibaca per `jenis_tahap` supaya tetap benar
 * walau kolom dinamis (nama/urutan/jumlah kolom berubah). Fallback ke tanggal di tiket.
 */
export function cycleDays(
  events: StageEvent[],
  fallbackStart?: Date | string | null,
  fallbackEnd?: Date | string | null,
): number | null {
  const start = earliest(events, "quotation") ?? (fallbackStart ? new Date(fallbackStart) : null);
  const end = earliest(events, "revenue") ?? (fallbackEnd ? new Date(fallbackEnd) : null);
  if (!start || !end) return null;
  const days = (end.getTime() - start.getTime()) / MS_PER_DAY;
  return days < 0 ? null : Math.round(days * 10) / 10;
}
