export type JenisKegiatan = "kunjungan" | "follow_up" | "penawaran" | "closing";

export interface Aktivitas {
  id_aktivitas: string;
  id_user: string;
  id_tiket: string;
  tanggal: string;
  catatan: string;
  jenis_kegiatan: JenisKegiatan;
  jadwal_follow_up: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAktivitasInput {
  id_user: string;
  id_tiket: string;
  tanggal: string;
  catatan: string;
  jenis_kegiatan: JenisKegiatan;
  jadwal_follow_up?: string | null;
}
