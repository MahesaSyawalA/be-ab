import { cycleDays } from "../../common/utils/sales-cycle.ts";
import { analyticsRepository as repo } from "./analytics.repository.ts";
import type {
  AnalyticsFilters,
  PerformaSales,
  PerformaSalesItem,
  SiklusPenjualan,
  TopSpenderItem,
} from "./analytics.types.ts";

const MS_PER_DAY = 86_400_000;

/** Jumlahkan uang dalam sen (integer) agar hasil tetap persis 2 desimal. */
export const sumMoney = (values: number[]): number =>
  values.reduce((acc, v) => acc + Math.round(v * 100), 0) / 100;

const round1 = (n: number) => Math.round(n * 10) / 10;

export const roiPersen = (revenue: number, biaya: number | null): number | null =>
  biaya && biaya > 0 ? round1(((revenue - biaya) / biaya) * 100) : null;

/** Biaya sales dihitung proporsional: bulan periode = hari / 30 (minimal 1 bulan). */
export const periodMonths = (f: Pick<AnalyticsFilters, "from" | "to">): number =>
  Math.max(1, (f.to.getTime() - f.from.getTime()) / MS_PER_DAY / 30);

function groupValues<T>(rows: T[], key: (r: T) => string, value: (r: T) => number): Map<string, number[]> {
  const map = new Map<string, number[]>();
  for (const r of rows) {
    const k = key(r);
    map.set(k, [...(map.get(k) ?? []), value(r)]);
  }
  return map;
}

export const analyticsService = {
  async siklusPenjualan(f: AnalyticsFilters): Promise<SiklusPenjualan> {
    const tikets = await repo.getClosedTikets(f);
    const items = tikets.flatMap((t) => {
      const durasi = cycleDays(
        t.riwayat_tahap.map((r) => ({ jenis_tahap: r.tahap_tujuan.jenis_tahap, waktu_pindah: r.waktu_pindah })),
        t.tanggal_penawaran_awal,
        t.tanggal_closing,
      );
      return durasi === null
        ? []
        : [
            {
              id_tiket: t.id_tiket,
              judul: t.judul,
              nama_outlet: t.pelanggan.nama_outlet,
              nama_sales: t.user.nama,
              tanggal_penawaran_awal: t.tanggal_penawaran_awal,
              tanggal_closing: t.tanggal_closing,
              durasi_hari: durasi,
            },
          ];
    });
    const hari = items.map((i) => i.durasi_hari);
    return {
      jumlah_tiket: items.length,
      rata_rata_hari: hari.length ? round1(hari.reduce((a, b) => a + b, 0) / hari.length) : null,
      tercepat_hari: hari.length ? Math.min(...hari) : null,
      terlama_hari: hari.length ? Math.max(...hari) : null,
      items: items.sort((a, b) => b.durasi_hari - a.durasi_hari),
    };
  },

  async performaSales(f: AnalyticsFilters): Promise<PerformaSales> {
    const [sales, visits, revenues, won] = await Promise.all([
      repo.getSales(f),
      repo.getVisits(f),
      repo.getRealizedRevenue(f),
      repo.getWonCounts(f),
    ]);
    const kunjungan = groupValues(visits, (v) => v.id_user, () => 1);
    const revenue = groupValues(revenues, (r) => r.tiket.id_user, (r) => r.nilai_revenue);
    const wonBy = new Map(won.map((w) => [w.id_user, w._count._all]));
    const months = periodMonths(f);

    const items: PerformaSalesItem[] = sales.map((s) => {
      const jumlah = kunjungan.get(s.id_user)?.length ?? 0;
      const rev = sumMoney(revenue.get(s.id_user) ?? []);
      const biaya = s.biaya_bulanan === null ? null : Math.round(s.biaya_bulanan * months * 100) / 100;
      return {
        id_user: s.id_user,
        nama: s.nama,
        jumlah_kunjungan: jumlah,
        jumlah_tiket_won: wonBy.get(s.id_user) ?? 0,
        revenue: rev,
        revenue_per_kunjungan: jumlah ? Math.round(rev / jumlah) : null,
        biaya,
        roi_persen: roiPersen(rev, biaya),
      };
    });

    const totalRevenue = sumMoney(items.map((i) => i.revenue));
    const biayaItems = items.flatMap((i) => (i.biaya === null ? [] : [i.biaya]));
    const totalBiaya = biayaItems.length ? sumMoney(biayaItems) : null;
    return {
      ringkasan: {
        total_revenue: totalRevenue,
        total_kunjungan: items.reduce((a, i) => a + i.jumlah_kunjungan, 0),
        total_biaya: totalBiaya,
        roi_persen: roiPersen(totalRevenue, totalBiaya),
      },
      items: items.sort((a, b) => b.revenue - a.revenue),
    };
  },

  async topSpenders(f: AnalyticsFilters, limit: number): Promise<TopSpenderItem[]> {
    const pos = await repo.getPurchaseOrders(f);
    const byPelanggan = new Map<string, { info: TopSpenderItem; nilai: number[] }>();
    for (const po of pos) {
      const p = po.tiket.pelanggan;
      const cur = byPelanggan.get(p.id_pelanggan) ?? {
        info: {
          id_pelanggan: p.id_pelanggan,
          nama_outlet: p.nama_outlet,
          tipe_outlet: p.tipe_outlet,
          jumlah_po: 0,
          total_nilai_po: 0,
        },
        nilai: [],
      };
      cur.info.jumlah_po += 1;
      cur.nilai.push(po.nilai_po);
      byPelanggan.set(p.id_pelanggan, cur);
    }
    return [...byPelanggan.values()]
      .map(({ info, nilai }) => ({ ...info, total_nilai_po: sumMoney(nilai) }))
      .sort((a, b) => b.total_nilai_po - a.total_nilai_po)
      .slice(0, limit);
  },
};
