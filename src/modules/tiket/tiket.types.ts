export type TiketStatus = "open" | "won" | "lost";
export type TiketPrioritas = "rendah" | "sedang" | "tinggi";

export interface Tiket {
  id_tiket: string;
  id_pelanggan: string;
  id_user: string;
  id_tahap: string;
  id_kontak: string | null;
  judul: string;
  estimasi_nilai: number;
  estimasi_closing: string;
  status: TiketStatus;
  kebutuhan_pelanggan: string;
  prioritas: TiketPrioritas;
  posisi: number;
  tanggal_penawaran_awal: string | null;
  tanggal_closing: string | null;
  alasan_lost: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTiketInput {
  id_pelanggan: string;
  id_user: string;
  id_tahap: string;
  id_kontak?: string | null;
  judul: string;
  estimasi_nilai: number;
  estimasi_closing: string;
  status: TiketStatus;
  kebutuhan_pelanggan: string;
  prioritas: TiketPrioritas;
  posisi: number;
  tanggal_penawaran_awal?: string | null;
  tanggal_closing?: string | null;
  alasan_lost?: string | null;
}
