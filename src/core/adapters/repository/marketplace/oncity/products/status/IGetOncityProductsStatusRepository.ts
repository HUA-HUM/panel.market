import { MarketplaceProductsStatus } from '@/src/core/entitis/marketplace/shared/products/status/MarketplaceProductsStatus';

export interface IGetOncityProductsStatusRepository {
  execute(params?: {
    status?: 'ACTIVE' | 'PAUSED' | 'PENDING' | 'DELETED';
  }): Promise<MarketplaceProductsStatus[]>;
}
