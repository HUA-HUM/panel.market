export type OrderMarketplace = 'fravega' | 'megatone' | 'oncity';

export type OrderRange = {
  from: string;
  to: string;
};

export type OrderMarketplaceTotal = {
  marketplace: OrderMarketplace;
  total: number;
};

export type OrderItem = {
  marketplace: OrderMarketplace;
  orderId: string;
  createdAt: string;
  amount: number;
  customerName: string;
  latestStatus: string;
  raw: unknown;
};

export type OrdersOverviewResponse = {
  range: OrderRange;
  total: number;
  marketplaces: OrderMarketplaceTotal[];
  items: OrderItem[];
  errors: unknown[];
};

export type MarketplaceOrdersResponse = {
  marketplace: OrderMarketplace;
  range: OrderRange;
  total: number;
  items: OrderItem[];
};

export type OrdersRangeFilters = {
  from: string;
  to: string;
};
