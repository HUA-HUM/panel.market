export type MarketplaceProductsStatus = {
  status: string;
  total: number;
  percentage?: number;
};

export type MarketplaceProductsStatusSummary = {
  marketplace: string;
  total: number;
  statuses: MarketplaceProductsStatus[];
  statusMap: Record<string, number>;
  statusPercentageMap: Record<string, number>;
};
