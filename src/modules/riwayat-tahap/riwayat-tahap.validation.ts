import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";
import {
  nonEmptyUpdate,
  optionalIsoDate,
} from "../../common/utils/validation.ts";

export const createRiwayatTahapSchema = z.object({
  id_tiket: z.uuid({ error: "ID Tiket wajib diisi dengan format UUID yang valid" }),
  id_tahap_asal: z.uuid({ message: "ID Tahap asal tidak valid" }).nullable().optional(),
  id_tahap_tujuan: z.uuid({ error: "ID Tahap tujuan wajib diisi dengan format UUID yang valid" }),
  id_user: z.uuid({ error: "ID User wajib diisi dengan format UUID yang valid" }),
  waktu_pindah: optionalIsoDate("Waktu pindah"),
});

export const updateRiwayatTahapSchema = nonEmptyUpdate(createRiwayatTahapSchema.partial());

export const riwayatTahapQuerySchema = paginationQuerySchema.extend({
  id_tiket: z.uuid({ message: "ID Tiket tidak valid" }).optional(),
  id_user: z.uuid({ message: "ID User tidak valid" }).optional(),
  id_tahap_asal: z.uuid({ message: "ID Tahap asal tidak valid" }).optional(),
  id_tahap_tujuan: z.uuid({ message: "ID Tahap tujuan tidak valid" }).optional(),
});
