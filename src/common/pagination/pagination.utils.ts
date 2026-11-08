import type { PaginationMeta, PaginationParams } from "./pagination.types.ts";

export const toSkipTake = ({ page, limit }: Pick<PaginationParams, "page" | "limit">) => ({
  skip: (page - 1) * limit,
  take: limit,
});

export const buildMeta = (
  total: number,
  { page, limit }: Pick<PaginationParams, "page" | "limit">,
): PaginationMeta => {
  const total_pages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    total_pages,
    has_next: page < total_pages,
    has_prev: page > 1,
  };
};