export type MarketplacePublicationItem = {
  marketplace: string;
  marketplaceSku: string;
  externalId: string;
  price: number;
  stock: number;
  status: string;
  isActive: boolean;
  lastSeenAt: string | null;
  updatedAt: string | null;
};

export type MarketplaceProductPresence = {
  sellerSku: string;
  marketplaces: string[];
  priceByMarketplace: Record<string, number>;
  stockByMarketplace: Record<string, number>;
  statusByMarketplace: Record<string, string>;
  items: MarketplacePublicationItem[];
};

export interface IGetMarketplaceProductBySkuRepository {
  execute(sellerSku: string): Promise<MarketplaceProductPresence>;
}
