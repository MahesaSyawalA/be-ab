import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import {
  nonEmptyUpdate,
  requiredString,
} from "../../common/utils/validation.ts";

export const createUserSchema = z.object({
  id_squad: z.uuidv4({ message: "ID Squad tidak valid" }).nullable().optional(),
  nama: requiredString("Nama", 100),
  role: z.enum(["sales", "sales_manager", "director", "admin"], {
    error: "Role wajib dipilih (sales, sales_manager, director, atau admin)",
  }),
  email: z
    .string({ error: "Email wajib diisi" })
    .trim()
    .min(1, { message: "Email wajib diisi" })
    .max(150, { message: "Email maksimal 150 karakter" })
    .toLowerCase()
    .pipe(z.email({ message: "Format email tidak valid" })),
  no_telp: requiredString("Nomor telepon", 20),
  password: z
    .string({ error: "Password wajib diisi" })
    .min(8, { message: "Password minimal 8 karakter" })
    .max(72, { message: "Password maksimal 72 karakter" }),
  send_credentials: z.boolean().optional(),
  must_change_password: z.boolean().default(true),
});

export const updateUserSchema = nonEmptyUpdate(
  z.object({
    id_squad: z.uuidv4({ message: "ID Squad tidak valid" }).nullable().optional(),
    nama: requiredString("Nama", 100).optional(),
    role: z
      .enum(["sales", "sales_manager", "director", "admin"], {
        error: "Role tidak valid",
      })
      .optional(),
    email: z
      .string()
      .trim()
      .max(150, { message: "Email maksimal 150 karakter" })
      .toLowerCase()
      .pipe(z.email({ message: "Format email tidak valid" }))
      .optional(),
    no_telp: requiredString("Nomor telepon", 20).optional(),
    is_active: z.boolean().optional(),
    biaya_bulanan: z.number().min(0, { message: "Biaya bulanan minimal 0" }).nullable().optional(),
    password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter" })
      .max(72, { message: "Password maksimal 72 karakter" })
      .optional(),
  })
);

export const updateProfileSchema = z
  .object({
    nama: requiredString("Nama", 100).optional(),
    no_telp: requiredString("Nomor telepon", 20).optional(),
  })
  .refine((data) => data.nama !== undefined || data.no_telp !== undefined, {
    message: "Minimal satu field (nama atau no_telp) harus diisi",
  });

export const resetPasswordSchema = z.object({
  new_password: z
    .string({ error: "Password baru wajib diisi" })
    .min(8, { message: "Password baru minimal 8 karakter" })
    .max(72, { message: "Password baru maksimal 72 karakter" }),
  must_change_password: z.boolean().optional(),
});

export const userQuerySchema = paginationQuerySchema.extend({
  sort_by: z
    .enum(["created_at", "nama", "role"], {
      message: "sort_by harus created_at, nama, atau role",
    })
    .default("created_at"),

  id_squad: z.uuidv4({ message: "ID Squad tidak valid" }).optional(),

  role: z
    .enum(["sales", "sales_manager", "director", "admin"], {
      message: "Pilih role user yang valid",
    })
    .optional(),

  is_active: z
    .enum(["true", "false"], { message: "is_active harus true atau false" })
    .transform((v) => v === "true")
    .optional(),

  search: z
    .string()
    .trim()
    .min(1, { message: "Search tidak boleh kosong" })
    .max(150, { message: "Search maksimal 150 karakter" })
    .optional(),
});
