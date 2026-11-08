import { z } from "zod";
import { paginationQuerySchema } from "../../common/pagination/pagination.schema.ts";

export const createRiwayatTahapSchema = z.object({
  id_tiket: z.uuid({ message: "ID Tiket tidak valid atau belum dipilih" }),
  id_tahap_asal: z.uuid({ message: "ID Tahap asal tidak valid" }).nullable().optional(),
  id_tahap_tujuan: z.uuid({ message: "ID Tahap tujuan tidak valid atau belum dipilih" }),
  id_user: z.uuid({ message: "ID User tidak valid" }),
  waktu_pindah: z.string().optional(),
});

export const updateRiwayatTahapSchema = createRiwayatTahapSchema.partial();

export const riwayatTahapQuerySchema = paginationQuerySchema.extend({
  id_tiket: z.uuid({ message: "ID Tiket tidak valid" }).optional(),
  id_user: z.uuid({ message: "ID User tidak valid" }).optional(),
  id_tahap_asal: z.uuid({ message: "ID Tahap asal tidak valid" }).optional(),
  id_tahap_tujuan: z.uuid({ message: "ID Tahap tujuan tidak valid" }).optional(),
});