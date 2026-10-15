import { z } from "zod";

export const createNotifikasiSchema = z.object({
  id_tiket: z.uuidv4(),
  title: z.string(),
  isRead: z.boolean().optional(),
  message: z.string(),
});
