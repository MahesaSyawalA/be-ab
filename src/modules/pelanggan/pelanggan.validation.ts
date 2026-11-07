import { z } from "zod";

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
  latitude: z.coerce.number({ message: "Latitude harus berupa angka" }),
  longitude: z.coerce.number({ message: "Longitude harus berupa angka" }),
  radius_kunjungan: z.coerce.number({
    message: "Radius kunjungan harus berupa angka",
  }),
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