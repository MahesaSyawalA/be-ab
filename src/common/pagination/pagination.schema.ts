import { z } from "zod";

export const DEFAULT_PAGE_LIMIT = 10;
export const MAX_PAGE_LIMIT = 100;

export const paginationQuerySchema = z.object({
  page: z.coerce
    .number({ message: "Page harus berupa angka" })
    .int({ message: "Page harus berupa bilangan bulat" })
    .min(1, { message: "Page minimal 1" })
    .default(1),
  limit: z.coerce
    .number({ message: "Limit harus berupa angka" })
    .int({ message: "Limit harus berupa bilangan bulat" })
    .min(1, { message: "Limit minimal 1" })
    .max(MAX_PAGE_LIMIT, { message: `Limit maksimal ${MAX_PAGE_LIMIT}` })
    .default(DEFAULT_PAGE_LIMIT),
  order: z.enum(["asc", "desc"], { message: "Order harus asc atau desc" }).default("desc"),
});