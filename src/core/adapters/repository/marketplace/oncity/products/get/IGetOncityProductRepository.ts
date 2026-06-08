import { MarketplaceProduct } from '@/src/core/entitis/marketplace/shared/products/get/MarketplaceProduct';
import { PaginatedResult } from '@/src/core/entitis/marketplace/shared/products/get/pagination/PaginatedResult';

export interface IGetOncityProductsRepository {
  execute(params: {
    offset: number;
    limit: number;
    sku?: string;
    status?: 'ACTIVE' | 'ERROR';
  }): Promise<PaginatedResult<MarketplaceProduct>>;
}
