import type { Request, Response } from "express";
import { analyticsService } from "./analytics.service.ts";
import { analyticsQuerySchema } from "./analytics.validation.ts";
import type { AnalyticsFilters } from "./analytics.types.ts";

const DAY = 86_400_000;

/** Default periode: bulan berjalan. `to` dari client inklusif, disimpan eksklusif (+1 hari). */
function parseQuery(req: Request, res: Response): { filters: AnalyticsFilters; limit: number } | null {
  const parsed = analyticsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Query tidak valid" });
    return null;
  }
  const { from, to, limit, ...rest } = parsed.data;
  const now = new Date();
  const start = from ? new Date(from) : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = to
    ? new Date(new Date(to).getTime() + DAY)
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  if (end <= start) {
    res.status(400).json({ message: "Rentang tanggal tidak valid" });
    return null;
  }
  return { filters: { from: start, to: end, ...rest }, limit };
}

export const analyticsController = {
  async siklusPenjualan(req: Request, res: Response) {
    const q = parseQuery(req, res);
    if (q) res.status(200).json({ data: await analyticsService.siklusPenjualan(q.filters) });
  },

  async performaSales(req: Request, res: Response) {
    const q = parseQuery(req, res);
    if (!q) return;
    const data = await analyticsService.performaSales(q.filters);
    // Gaji/biaya & ROI hanya untuk direktur/admin.
    if (req.user?.role === "sales_manager") {
      data.ringkasan.total_biaya = null;
      data.ringkasan.roi_persen = null;
      data.items = data.items.map((i) => ({ ...i, biaya: null, roi_persen: null }));
    }
    res.status(200).json({ data });
  },

  async topSpenders(req: Request, res: Response) {
    const q = parseQuery(req, res);
    if (q) res.status(200).json({ data: await analyticsService.topSpenders(q.filters, q.limit) });
  },
};
