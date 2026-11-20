export type DocPrefix = "QUO" | "PO";

/** Format nomor dokumen: `QUO/ABM/2026/11/003` (urut per bulan, 3 digit). */
export function formatDocNumber(prefix: DocPrefix, date: Date, seq: number): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${prefix}/ABM/${date.getFullYear()}/${month}/${String(seq).padStart(3, "0")}`;
}
