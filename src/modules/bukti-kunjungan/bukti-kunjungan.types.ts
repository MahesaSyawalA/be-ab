export interface BuktiKunjungan {
  id_bukti: string;
  id_aktivitas: string;
  longitude: number;
  latitude: number;
  jarak_klien: number;
  dalam_radius: boolean;
  img_url: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBuktiKunjunganInput {
  id_aktivitas: string;
  longitude: number;
  latitude: number;
  jarak_klien: number;
  dalam_radius: boolean;
  img_url: string;
}
