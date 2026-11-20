import { describe, expect, it } from "vitest";
import { formatDocNumber } from "./doc-number.ts";

describe("formatDocNumber", () => {
  it("memakai tahun, bulan 2 digit, dan urutan 3 digit", () => {
    expect(formatDocNumber("QUO", new Date(2026, 10, 20), 3)).toBe("QUO/ABM/2026/11/003");
    expect(formatDocNumber("PO", new Date(2026, 0, 5), 12)).toBe("PO/ABM/2026/01/012");
  });
});
