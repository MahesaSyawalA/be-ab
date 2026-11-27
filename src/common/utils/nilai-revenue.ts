export interface PoRevenue {
  status: string;
  nilai_po: number;
  nilai_revenue: number;
  tanggal_po: Date;
  tanggal_revenue: Date | null;
  created_at: Date;
}

/** Satu-satunya aturan nilai revenue tiket (dipakai respons tiket dan analytics): dihitung sejak tahap PO, dari PO terbaru. */
export function hitungNilaiRevenue(
  statusTiket: string,
  jenisTahap: string | undefined,
  purchaseOrders: PoRevenue[],
): { nilai: number; tanggal: Date } | null {
  if (statusTiket === "lost" || (jenisTahap !== "po" && jenisTahap !== "revenue")) return null;
  const po = purchaseOrders
    .filter((p) => p.status !== "dibatalkan")
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())[0];
  if (!po) return null;
  const hasil =
    jenisTahap === "revenue" && po.tanggal_revenue
      ? { nilai: po.nilai_revenue, tanggal: po.tanggal_revenue }
      : { nilai: po.nilai_po, tanggal: po.tanggal_po };
  return hasil.nilai > 0 ? hasil : null;
}

/** Realisasi saat masuk tahap revenue: isian user, kalau tidak ada ikut nilai PO (bukan estimasi). */
export function nilaiRealisasi(
  statusTiket: string,
  nilaiDokumen: number | undefined,
  nilaiPo: number | undefined,
  cadangan: number,
): number {
  if (statusTiket === "lost") return 0;
  return nilaiDokumen ?? (nilaiPo || cadangan);
}
