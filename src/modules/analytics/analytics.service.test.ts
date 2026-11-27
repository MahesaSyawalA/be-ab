import { describe, expect, it, vi } from "vitest";
import { analyticsRepository } from "./analytics.repository.ts";
import { analyticsService, periodMonths, revenueDalamPeriode, roiPersen, sumMoney } from "./analytics.service.ts";

describe("analytics helpers", () => {
  it("sumMoney tidak kena error float", () => {
    expect(sumMoney([0.1, 0.2])).toBe(0.3);
  });

  it("roiPersen = (revenue - biaya) / biaya * 100, null bila biaya kosong/0", () => {
    expect(roiPersen(30_000_000, 10_000_000)).toBe(200);
    expect(roiPersen(5_000_000, 10_000_000)).toBe(-50);
    expect(roiPersen(1, null)).toBeNull();
    expect(roiPersen(1, 0)).toBeNull();
  });

  it("periodMonths minimal 1 bulan, proporsional di atasnya", () => {
    expect(periodMonths({ from: new Date("2026-11-01"), to: new Date("2026-11-08") })).toBe(1);
    expect(periodMonths({ from: new Date("2026-09-01"), to: new Date("2026-12-01") })).toBeCloseTo(3.03, 1);
  });

  it("total_revenue ikut tiket milik non-sales; daftar dan ROI tetap sales saja", async () => {
    const tiket = (id_user: string, nilai: number) => ({
      id_user,
      status: "open",
      tahap: { jenis_tahap: "po" },
      purchase_order: [{
        status: "diterima", nilai_po: nilai, nilai_revenue: 0,
        tanggal_po: new Date("2026-11-05"), tanggal_revenue: null, created_at: new Date("2026-11-05"),
      }],
    });
    vi.spyOn(analyticsRepository, "getSales").mockResolvedValue([{ id_user: "s", nama: "S", biaya_bulanan: 50 }] as never);
    vi.spyOn(analyticsRepository, "getVisits").mockResolvedValue([] as never);
    vi.spyOn(analyticsRepository, "getWonCounts").mockResolvedValue([] as never);
    vi.spyOn(analyticsRepository, "getRevenueTikets").mockResolvedValue([tiket("s", 100), tiket("director", 900)] as never);

    const hasil = await analyticsService.performaSales({ from: new Date("2026-11-01"), to: new Date("2026-12-01") });

    expect(hasil.ringkasan.total_revenue).toBe(1000);
    expect(hasil.ringkasan.roi_persen).toBe(100);
    expect(hasil.items.map((i) => i.revenue)).toEqual([100]);
    vi.restoreAllMocks();
  });

  it("revenueDalamPeriode: from inklusif, to eksklusif", () => {
    const tiket = (tanggal: string) => ({
      status: "open",
      tahap: { jenis_tahap: "po" },
      purchase_order: [{
        status: "diterima", nilai_po: 100, nilai_revenue: 0,
        tanggal_po: new Date(tanggal), tanggal_revenue: null, created_at: new Date(tanggal),
      }],
    });
    const f = { from: new Date("2026-11-01"), to: new Date("2026-12-01") };
    const hasil = revenueDalamPeriode([tiket("2026-11-01"), tiket("2026-12-01"), tiket("2026-10-31")], f);
    expect(hasil.map((h) => h.nilai)).toEqual([100]);
  });
});
