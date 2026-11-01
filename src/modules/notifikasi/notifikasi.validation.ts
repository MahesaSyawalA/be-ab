import { z } from "zod";

export const createNotifikasiSchema = z.object({
  id_tiket: z.uuid({ message: "ID Tiket tidak valid atau belum dipilih" }),
  title: z.string().min(1, { message: "Judul notifikasi wajib diisi" }),
  isRead: z.boolean().optional(),
  message: z.string().min(1, { message: "Pesan notifikasi tidak boleh kosong" }),
});

export const updateNotifikasiSchema = createNotifikasiSchema.partial();
