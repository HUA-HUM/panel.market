export type MarketplaceProductsListSummary = {
  marketplace: string;
  total: number;
  statuses: Array<{
    status: string;
    total: number;
    percentage: number;
  }>;
  statusMap: Record<string, number>;
  statusPercentageMap: Record<string, number>;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  count?: number;
  hasNext: boolean;
  nextOffset?: number;
  summary?: MarketplaceProductsListSummary;
};
