import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

const parseJsonString = (value: unknown) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const kontakSchema = z.array(
  z.object({
    nama: z.string().min(1, { message: "Nama kontak wajib diisi" }),
    jabatan: z.string().min(1, { message: "Jabatan wajib diisi" }),
    no_telp: z
      .string()
      .min(9, { message: "Nomor telepon minimal 9 digit" }),
    email: z.string().email({ message: "Format email tidak valid" }),
  }),
  { message: "Kontak harus berupa array JSON yang valid" },
);

const pelangganBaseSchema = z.object({
  nama_outlet: z.string().min(1, { message: "Nama outlet wajib diisi" }),
  tipe_outlet: z.string().min(1, { message: "Tipe outlet wajib diisi/dipilih" }),
  nama_faskes: z.string().min(1, { message: "Nama faskes wajib diisi" }).optional().nullable(),
  tipe_faskes: z.string().min(1, { message: "Tipe faskes wajib diisi/dipilih" }).optional().nullable(),
  alamat: z
    .string()
    .min(5, { message: "Alamat terlalu pendek, minimal 5 karakter" }),
  latitude: z.coerce
    .number({ message: "Latitude harus berupa angka" })
    .min(-90, { message: "Latitude minimal -90" })
    .max(90, { message: "Latitude maksimal 90" }),
  longitude: z.coerce
    .number({ message: "Longitude harus berupa angka" })
    .min(-180, { message: "Longitude minimal -180" })
    .max(180, { message: "Longitude maksimal 180" }),
  radius_kunjungan: z.coerce
    .number({ message: "Radius kunjungan harus berupa angka" })
    .min(1, { message: "Radius kunjungan minimal 1 meter" }),
  kontak: z.preprocess(parseJsonString, kontakSchema.optional()),
});

export const createPelangganSchema = pelangganBaseSchema
  .refine((data) => Boolean(data.nama_outlet || data.nama_faskes), {
    message: "Nama faskes / outlet wajib diisi",
    path: ["nama_faskes"],
  })
  .refine((data) => Boolean(data.tipe_outlet || data.tipe_faskes), {
    message: "Tipe faskes / outlet wajib diisi",
    path: ["tipe_faskes"],
  });

export const updatePelangganSchema = pelangganBaseSchema
  .omit({ kontak: true })
  .partial();

export const pelangganQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).optional(),
  tipe_outlet: z.string().trim().min(1, { message: "Tipe outlet tidak boleh kosong" }).optional(),
  status: z
    .enum(["Aktif", "Nonaktif", "Prospek"], {
      message: "Status harus Aktif, Nonaktif, atau Prospek",
    })
    .optional(),
});