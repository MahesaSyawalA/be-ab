export type SortOrder = "asc" | "desc";

export interface PaginationParams {
  page: number;
  limit: number;
  order: SortOrder;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}