import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import {
  nonEmptyUpdate,
  optionalString,
  requiredEmail,
  requiredString,
} from "../../common/utils/validation.ts";

export const createKontakSchema = z.object({
  id_pelanggan: z.uuid({ error: "ID Pelanggan wajib diisi dengan format UUID yang valid" }),
  nama: requiredString("Nama kontak", 150),
  jabatan: requiredString("Jabatan", 100),
  no_telp: requiredString("Nomor telepon", 20, 9),
  email: requiredEmail("Email", 150),
  kategori_peran: optionalString("Kategori peran", 50),
  inisial: optionalString("Inisial", 10),
});

export const updateKontakSchema = nonEmptyUpdate(createKontakSchema.partial());

export const kontakQuerySchema = paginationQuerySchema.extend({
  id_pelanggan: z.uuid({ message: "ID Pelanggan tidak valid" }).optional(),
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).max(150).optional(),
});
