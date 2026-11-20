import { prisma } from "../../config/prisma.ts";
import type { Prisma } from "@prisma/client";
import type { AnalyticsFilters } from "./analytics.types.ts";

const range = (f: AnalyticsFilters) => ({ gte: f.from, lt: f.to });

const salesWhere = (f: AnalyticsFilters): Prisma.UserWhereInput => ({
  id_user: f.id_user,
  id_squad: f.id_squad,
});

const tiketWhere = (f: AnalyticsFilters): Prisma.TiketWhereInput => ({
  user: salesWhere(f),
  ...(f.tipe_outlet && { pelanggan: { tipe_outlet: { contains: f.tipe_outlet } } }),
});

export const analyticsRepository = {
  /** Tiket won yang closing di periode, lengkap dengan riwayat tahap untuk hitung durasi. */
  getClosedTikets(f: AnalyticsFilters) {
    return prisma.tiket.findMany({
      where: { ...tiketWhere(f), status: "won", tanggal_closing: range(f) },
      include: {
        user: { select: { nama: true } },
        pelanggan: { select: { nama_outlet: true } },
        riwayat_tahap: { include: { tahap_tujuan: { select: { jenis_tahap: true } } } },
      },
    });
  },

  getSales(f: AnalyticsFilters) {
    return prisma.user.findMany({
      where: { ...salesWhere(f), role: "sales", is_active: true },
      select: { id_user: true, nama: true, biaya_bulanan: true },
      orderBy: { nama: "asc" },
    });
  },

  /** Kunjungan = aktivitas berjenis `visit` (kolom pertama pipeline). */
  getVisits(f: AnalyticsFilters) {
    return prisma.aktivitas.findMany({
      where: { jenis_kegiatan: "visit", tanggal: range(f), tiket: tiketWhere(f) },
      select: { id_user: true },
    });
  },

  getRealizedRevenue(f: AnalyticsFilters) {
    return prisma.purchaseOrder.findMany({
      where: { tanggal_revenue: range(f), tiket: tiketWhere(f) },
      select: { nilai_revenue: true, tiket: { select: { id_user: true } } },
    });
  },

  getWonCounts(f: AnalyticsFilters) {
    return prisma.tiket.groupBy({
      by: ["id_user"],
      where: { ...tiketWhere(f), status: "won", tanggal_closing: range(f) },
      _count: { _all: true },
    });
  },

  getPurchaseOrders(f: AnalyticsFilters) {
    return prisma.purchaseOrder.findMany({
      where: { tanggal_po: range(f), status: { not: "dibatalkan" }, tiket: tiketWhere(f) },
      select: {
        nilai_po: true,
        tiket: { select: { pelanggan: { select: { id_pelanggan: true, nama_outlet: true, tipe_outlet: true } } } },
      },
    });
  },
};
