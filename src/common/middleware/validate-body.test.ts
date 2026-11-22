import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { requiredNumber, requiredString } from "../utils/validation.ts";
import { validateBody } from "./validate-body.ts";

function createMockRes() {
  const res = {
    statusCode: 200,
    body: null as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

describe("validateBody middleware", () => {
  const sampleSchema = z.object({
    nama: requiredString("Nama", 100),
    jumlah: requiredNumber("Jumlah", { min: 1 }),
  });

  it("mengembalikan 400 dengan daftar field required saat body kosong ({})", () => {
    const req = { body: {} } as Request;
    const res = createMockRes();
    const next = vi.fn() as unknown as NextFunction;

    validateBody(sampleSchema)(req, res as unknown as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    const payload = res.body as {
      message: string;
      errors: Array<{ field?: string; message: string }>;
    };
    expect(payload.message).toBe("Validation failed");
    expect(payload.errors.length).toBeGreaterThanOrEqual(2);
    expect(payload.errors.some((e) => e.field === "nama" && /wajib diisi/i.test(e.message))).toBe(true);
    expect(payload.errors.some((e) => e.field === "jumlah" && /wajib diisi/i.test(e.message))).toBe(true);
  });

  it("mengembalikan 400 dengan daftar field required saat body undefined", () => {
    const req = { body: undefined } as Request;
    const res = createMockRes();
    const next = vi.fn() as unknown as NextFunction;

    validateBody(sampleSchema)(req, res as unknown as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    const payload = res.body as {
      errors: Array<{ field?: string; message: string }>;
    };
    expect(payload.errors.some((e) => e.field === "nama")).toBe(true);
    expect(payload.errors.some((e) => e.field === "jumlah")).toBe(true);
  });

  it("menolak string kosong pada field angka (tidak coerce '' menjadi 0)", () => {
    const req = { body: { nama: "Produk A", jumlah: "" } } as Request;
    const res = createMockRes();
    const next = vi.fn() as unknown as NextFunction;

    validateBody(sampleSchema)(req, res as unknown as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    const payload = res.body as {
      errors: Array<{ field?: string; message: string }>;
    };
    expect(payload.errors.some((e) => e.field === "jumlah" && /wajib diisi/i.test(e.message))).toBe(true);
  });

  it("menolak input mengandung pola XSS dengan status 400", () => {
    const req = {
      body: { nama: "<script>alert(1)</script>", jumlah: 5 },
    } as Request;
    const res = createMockRes();
    const next = vi.fn() as unknown as NextFunction;

    validateBody(sampleSchema)(req, res as unknown as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
  });

  it("meneruskan request yang valid dan memangkas whitespace", () => {
    const req = { body: { nama: "  Produk Medis  ", jumlah: "10" } } as Request;
    const res = createMockRes();
    const next = vi.fn() as unknown as NextFunction;

    validateBody(sampleSchema)(req, res as unknown as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toEqual({ nama: "Produk Medis", jumlah: 10 });
  });
});
