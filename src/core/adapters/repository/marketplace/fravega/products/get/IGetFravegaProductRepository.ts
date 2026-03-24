import { MarketplaceProduct } from '@/src/core/entitis/marketplace/shared/products/get/MarketplaceProduct';
import { PaginatedResult } from '@/src/core/entitis/marketplace/shared/products/get/pagination/PaginatedResult';

export interface IGetFravegaProductsRepository {
  execute(params: {
    offset: number;
    limit: number;
  }): Promise<PaginatedResult<MarketplaceProduct>>;
}
