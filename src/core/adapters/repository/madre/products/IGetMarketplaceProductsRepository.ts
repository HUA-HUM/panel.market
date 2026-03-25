import { MarketplaceProductPresence } from '@/src/core/adapters/repository/madre/products/IGetMarketplaceProductBySkuRepository';

export type PaginatedMarketplaceProductsResponse = {
  items: MarketplaceProductPresence[];
  total: number;
  limit: number;
  offset: number;
};

export interface IGetMarketplaceProductsRepository {
  execute(params: {
    offset: number;
    limit: number;
  }): Promise<PaginatedMarketplaceProductsResponse>;
}
