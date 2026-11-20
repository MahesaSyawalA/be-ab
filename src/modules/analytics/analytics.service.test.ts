import { describe, expect, it } from "vitest";
import { periodMonths, roiPersen, sumMoney } from "./analytics.service.ts";

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
});
