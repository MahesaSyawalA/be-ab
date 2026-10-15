export type StatusPenawaran = "draft" | "dikirim" | "disetujui" | "ditolak";

export interface Penawaran {
  id_penawaran: string;
  id_tiket: string;
  id_aktivitas: string | null;
  no_penawaran: string;
  revisi_ke: number;
  tanggal_penawaran: string;
  total_nilai: number;
  status: StatusPenawaran;
  url_file_penawaran: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePenawaranInput {
  id_tiket: string;
  id_aktivitas?: string | null;
  no_penawaran: string;
  revisi_ke: number;
  tanggal_penawaran: string;
  total_nilai: number;
  status: StatusPenawaran;
  url_file_penawaran: string;
}
