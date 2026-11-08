import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

export const createKontakSchema = z.object({
  id_pelanggan: z.uuid({ message: "Pilih pelanggan yang sesuai terlebih dahulu" }),
  nama: z.string().min(1, { message: "Nama kontak wajib diisi" }),
  jabatan: z.string().min(1, { message: "Jabatan wajib diisi" }),
  no_telp: z.string().min(9, { message: "Nomor telepon minimal 9 digit" }),
  email: z.string().min(1, { message: "Email wajib diisi" }).email({ message: "Format email tidak valid (contoh: user@mail.com)" }),
  kategori_peran: z.string().optional(),
  inisial: z.string().optional(),
});

export const updateKontakSchema = createKontakSchema.partial();

export const kontakQuerySchema = paginationQuerySchema.extend({
  id_pelanggan: z.uuid({ message: "ID Pelanggan tidak valid" }).optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).optional(),
});