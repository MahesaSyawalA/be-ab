export interface Kontak {
  id_kontak: string;
  id_pelanggan: string;
  nama: string;
  jabatan: string;
  no_telp: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CreateKontakInput {
  id_pelanggan: string;
  nama: string;
  jabatan: string;
  no_telp: string;
  email: string;
}
