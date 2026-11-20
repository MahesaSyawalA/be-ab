import { describe, expect, it } from "vitest";
import { cycleDays } from "./sales-cycle.ts";

describe("cycleDays", () => {
  it("memakai kemunculan pertama tiap jenis tahap, meski ada banyak kolom sejenis", () => {
    const events = [
      { jenis_tahap: "quotation", waktu_pindah: "2026-10-10T00:00:00Z" },
      { jenis_tahap: "quotation", waktu_pindah: "2026-10-12T00:00:00Z" },
      { jenis_tahap: "revenue", waktu_pindah: "2026-10-20T00:00:00Z" },
    ];
    expect(cycleDays(events)).toBe(10);
  });

  it("fallback ke tanggal tiket bila riwayat tidak lengkap", () => {
    expect(cycleDays([], "2026-10-01", "2026-10-04")).toBe(3);
  });

  it("null bila belum closing atau urutan terbalik", () => {
    expect(cycleDays([{ jenis_tahap: "quotation", waktu_pindah: "2026-10-01" }])).toBeNull();
    expect(cycleDays([], "2026-10-05", "2026-10-01")).toBeNull();
  });
});
