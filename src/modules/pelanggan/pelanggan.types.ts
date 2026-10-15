export interface Pelanggan {
  id_pelanggan: string;
  nama_faskes: string;
  tipe_faskes: string;
  alamat: string;
  latitude: number;
  longitude: number;
  radius_kunjungan: number;
  img_url: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePelangganInput {
  nama_faskes: string;
  tipe_faskes: string;
  alamat: string;
  latitude: number;
  longitude: number;
  radius_kunjungan: number;
  img_url: string;
}
