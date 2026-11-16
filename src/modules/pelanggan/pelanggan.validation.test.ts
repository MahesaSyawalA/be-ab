import { describe, expect, it } from "vitest";
import { createPelangganSchema } from "./pelanggan.validation.ts";

describe("pelanggan.validation", () => {
  const validData = {
    nama_outlet: "RS Sehat",
    tipe_outlet: "Rumah Sakit",
    alamat: "Jl. Sudirman No. 1",
    latitude: -6.2,
    longitude: 106.8,
    radius_kunjungan: 100,
  };

  it("menerima data valid", () => {
    const result = createPelangganSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("menolak latitude di bawah -90", () => {
    const result = createPelangganSchema.safeParse({ ...validData, latitude: -90.1 });
    expect(result.success).toBe(false);
  });

  it("menolak latitude di atas 90", () => {
    const result = createPelangganSchema.safeParse({ ...validData, latitude: 90.1 });
    expect(result.success).toBe(false);
  });

  it("menerima boundary latitude (-90 dan 90)", () => {
    expect(createPelangganSchema.safeParse({ ...validData, latitude: -90 }).success).toBe(true);
    expect(createPelangganSchema.safeParse({ ...validData, latitude: 90 }).success).toBe(true);
  });

  it("menolak longitude di bawah -180", () => {
    const result = createPelangganSchema.safeParse({ ...validData, longitude: -180.1 });
    expect(result.success).toBe(false);
  });

  it("menolak longitude di atas 180", () => {
    const result = createPelangganSchema.safeParse({ ...validData, longitude: 180.1 });
    expect(result.success).toBe(false);
  });

  it("menerima boundary longitude (-180 dan 180)", () => {
    expect(createPelangganSchema.safeParse({ ...validData, longitude: -180 }).success).toBe(true);
    expect(createPelangganSchema.safeParse({ ...validData, longitude: 180 }).success).toBe(true);
  });

  it("menolak radius_kunjungan kurang dari 1", () => {
    const result = createPelangganSchema.safeParse({ ...validData, radius_kunjungan: 0 });
    expect(result.success).toBe(false);
  });

  it("menerima radius_kunjungan minimal 1", () => {
    const result = createPelangganSchema.safeParse({ ...validData, radius_kunjungan: 1 });
    expect(result.success).toBe(true);
  });
});
