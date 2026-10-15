import type { Notifikasi } from "./notifikasi.types.ts";

const notifikasiList: Notifikasi[] = [];

export const notifikasiRepository = {
  async create(data: Notifikasi): Promise<Notifikasi> {
    notifikasiList.push(data);
    return data;
  },

  async getAll(): Promise<Notifikasi[]> {
    return notifikasiList;
  },

  async getById(id: string): Promise<Notifikasi | undefined> {
    return notifikasiList.find((item) => item.id_notifikasi === id);
  },

  async getByTiketId(idTiket: string): Promise<Notifikasi[]> {
    return notifikasiList.filter((item) => item.id_tiket === idTiket);
  },

  async markAsRead(id: string): Promise<Notifikasi | undefined> {
    const notif = notifikasiList.find((item) => item.id_notifikasi === id);
    if (notif) {
      notif.isRead = true;
      notif.updated_at = new Date().toISOString();
    }
    return notif;
  },
};
