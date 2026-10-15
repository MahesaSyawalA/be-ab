export interface Notifikasi {
  id_notifikasi: string;
  id_tiket: string;
  title: string;
  isRead: boolean;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNotifikasiInput {
  id_tiket: string;
  title: string;
  isRead?: boolean;
  message: string;
}
