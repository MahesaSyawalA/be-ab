import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import {
  optionalString,
  requiredEmail,
  requiredNumber,
  requiredString,
} from "../../common/utils/validation.ts";

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
    nama: requiredString("Nama kontak", 150),
    jabatan: requiredString("Jabatan", 100),
    no_telp: requiredString("Nomor telepon", 20, 9),
    email: requiredEmail("Email", 150),
  }),
  { error: "Kontak harus berupa array JSON yang valid" },
);

const pelangganBaseSchema = z.object({
  nama_outlet: requiredString("Nama outlet", 150),
  tipe_outlet: requiredString("Tipe outlet", 50),
  nama_faskes: optionalString("Nama faskes", 150).nullable(),
  tipe_faskes: optionalString("Tipe faskes", 50).nullable(),
  alamat: requiredString("Alamat", 1000, 5),
  latitude: requiredNumber("Latitude", { min: -90, max: 90 }),
  longitude: requiredNumber("Longitude", { min: -180, max: 180 }),
  radius_kunjungan: requiredNumber("Radius kunjungan", { min: 1, max: 100000 }),
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
  search: z.string().trim().min(1, { message: "Search tidak boleh kosong" }).max(150).optional(),
  tipe_outlet: z.string().trim().min(1, { message: "Tipe outlet tidak boleh kosong" }).max(50).optional(),
  status: z
    .enum(["Aktif", "Nonaktif", "Prospek"], {
      message: "Status harus Aktif, Nonaktif, atau Prospek",
    })
    .optional(),
});
