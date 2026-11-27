import { describe, expect, it } from "vitest";
import { hitungNilaiRevenue, nilaiRealisasi, type PoRevenue } from "./nilai-revenue.ts";

const po = (o: Partial<PoRevenue> = {}): PoRevenue => ({
  status: "diterima", nilai_po: 100, nilai_revenue: 0,
  tanggal_po: new Date("2026-11-01"), tanggal_revenue: null,
  created_at: new Date("2026-11-01"), ...o,
});
const realisasi = po({ nilai_revenue: 90, tanggal_revenue: new Date("2026-11-10"), status: "selesai" });

describe("nilaiRealisasi", () => {
  it("nilai isian menang; tanpa isian ikut PO, lalu cadangan; lost = 0", () => {
    expect(nilaiRealisasi("won", 90, 100, 80)).toBe(90);
    expect(nilaiRealisasi("won", undefined, 100, 80)).toBe(100);
    expect(nilaiRealisasi("won", undefined, 0, 80)).toBe(80);
    expect(nilaiRealisasi("won", undefined, undefined, 80)).toBe(80);
    expect(nilaiRealisasi("lost", 90, 100, 80)).toBe(0);
  });
});

describe("hitungNilaiRevenue", () => {
  it("null sebelum PO, saat lost, dan tanpa PO", () => {
    expect(hitungNilaiRevenue("open", "quotation", [po()])).toBeNull();
    expect(hitungNilaiRevenue("lost", "revenue", [realisasi])).toBeNull();
    expect(hitungNilaiRevenue("open", "po", [])).toBeNull();
  });
  it("tahap po memakai nilai_po", () => {
    expect(hitungNilaiRevenue("open", "po", [po()])).toEqual({ nilai: 100, tanggal: new Date("2026-11-01") });
  });
  it("tahap revenue memakai realisasi, juga saat status open", () => {
    expect(hitungNilaiRevenue("won", "revenue", [realisasi])).toEqual({ nilai: 90, tanggal: new Date("2026-11-10") });
    expect(hitungNilaiRevenue("open", "revenue", [realisasi])?.nilai).toBe(90);
  });
  it("dimundurkan ke po memakai nilai_po, ke follow_up tidak dihitung", () => {
    expect(hitungNilaiRevenue("open", "po", [realisasi])?.nilai).toBe(100);
    expect(hitungNilaiRevenue("open", "follow_up", [realisasi])).toBeNull();
  });
  it("PO ganda: hanya yang terbaru, urutan array tidak berpengaruh", () => {
    const baru = po({ nilai_po: 200, created_at: new Date("2026-11-05") });
    expect(hitungNilaiRevenue("open", "po", [po(), baru])?.nilai).toBe(200);
    expect(hitungNilaiRevenue("open", "po", [baru, po()])?.nilai).toBe(200);
  });
  it("PO dibatalkan dilewati, nilai 0 dianggap belum ada", () => {
    const batal = po({ status: "dibatalkan", nilai_po: 999, created_at: new Date("2026-11-09") });
    expect(hitungNilaiRevenue("open", "po", [po(), batal])?.nilai).toBe(100);
    expect(hitungNilaiRevenue("open", "po", [po({ nilai_po: 0 })])).toBeNull();
  });
});
