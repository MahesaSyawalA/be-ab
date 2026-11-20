export interface AnalyticsFilters {
  /** Awal periode (inklusif). */
  from: Date;
  /** Akhir periode (eksklusif). */
  to: Date;
  id_user?: string;
  id_squad?: string;
  tipe_outlet?: string;
}

export interface SiklusPenjualanItem {
  id_tiket: string;
  judul: string;
  nama_outlet: string;
  nama_sales: string;
  tanggal_penawaran_awal: Date | string | null;
  tanggal_closing: Date | string | null;
  durasi_hari: number;
}

export interface SiklusPenjualan {
  jumlah_tiket: number;
  rata_rata_hari: number | null;
  tercepat_hari: number | null;
  terlama_hari: number | null;
  items: SiklusPenjualanItem[];
}

export interface PerformaSalesItem {
  id_user: string;
  nama: string;
  jumlah_kunjungan: number;
  jumlah_tiket_won: number;
  revenue: number;
  revenue_per_kunjungan: number | null;
  biaya: number | null;
  /** (revenue - biaya) / biaya * 100; null bila biaya belum diisi. */
  roi_persen: number | null;
}

export interface PerformaSales {
  ringkasan: {
    total_revenue: number;
    total_kunjungan: number;
    total_biaya: number | null;
    roi_persen: number | null;
  };
  items: PerformaSalesItem[];
}

export interface TopSpenderItem {
  id_pelanggan: string;
  nama_outlet: string;
  tipe_outlet: string;
  jumlah_po: number;
  total_nilai_po: number;
}
