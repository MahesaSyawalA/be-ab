import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import { requiredNumber } from "../../common/utils/validation.ts";

export const createBuktiKunjunganSchema = z.object({
  id_aktivitas: z.uuid({
    error: "ID Aktivitas wajib diisi dengan format UUID yang valid",
  }),
  longitude: requiredNumber("Longitude", { min: -180, max: 180 }),
  latitude: requiredNumber("Latitude", { min: -90, max: 90 }),
  jarak_klien: requiredNumber("Jarak klien", { min: 0 }),
  dalam_radius: z
    .enum(["true", "false"], {
      error: "Status radius wajib diisi (true atau false)",
    })
    .transform((v) => v === "true"),
});

export const updateBuktiKunjunganSchema = createBuktiKunjunganSchema.partial();

export const buktiKunjunganQuerySchema = paginationQuerySchema.extend({
  id_aktivitas: z.uuid({ message: "ID Aktivitas tidak valid" }).optional(),
  dalam_radius: z
    .enum(["true", "false"], { message: "dalam_radius harus true atau false" })
    .transform((v) => v === "true")
    .optional(),
});
