import { describe, expect, it } from "vitest";
import { kejadianTiket, type KondisiTiket } from "./notifikasi.events.ts";

const k = (o: Partial<KondisiTiket> = {}): KondisiTiket => ({
  id_user: "s1", status: "open", jenis_tahap: "follow_up", ...o,
});

describe("kejadianTiket", () => {
  it("tiket baru dan pindah sales = ditugaskan", () => {
    expect(kejadianTiket(null, k())).toEqual(["ditugaskan"]);
    expect(kejadianTiket(k(), k({ id_user: "s2" }))).toEqual(["ditugaskan"]);
  });
  it("masuk po/revenue/lost hanya saat transisi", () => {
    expect(kejadianTiket(k(), k({ jenis_tahap: "po" }))).toEqual(["po"]);
    expect(kejadianTiket(k({ jenis_tahap: "po" }), k({ jenis_tahap: "revenue" }))).toEqual(["revenue"]);
    expect(kejadianTiket(k(), k({ status: "lost" }))).toEqual(["lost"]);
    expect(kejadianTiket(k({ jenis_tahap: "po" }), k({ jenis_tahap: "po" }))).toEqual([]);
    expect(kejadianTiket(k({ status: "lost" }), k({ status: "lost" }))).toEqual([]);
  });
  it("lost menang atas tahap; tiket lost tidak memicu po/revenue", () => {
    expect(kejadianTiket(k(), k({ status: "lost", jenis_tahap: "po" }))).toEqual(["lost"]);
    expect(kejadianTiket(k({ status: "lost" }), k({ status: "lost", jenis_tahap: "po" }))).toEqual([]);
  });
  it("tiket baru langsung di po memicu keduanya", () => {
    expect(kejadianTiket(null, k({ jenis_tahap: "po" }))).toEqual(["ditugaskan", "po"]);
  });
});
