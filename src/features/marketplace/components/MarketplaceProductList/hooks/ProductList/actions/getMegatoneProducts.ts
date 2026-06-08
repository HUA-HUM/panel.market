'use server';

import { PaginatedResult } from '@/src/core/entitis/marketplace/shared/products/get/pagination/PaginatedResult';
import { MarketplaceProduct } from '@/src/core/entitis/marketplace/shared/products/get/MarketplaceProduct';
import { IGetMegatoneProductsRepository } from '@/src/core/adapters/repository/marketplace/megatone/products/get/IGetMegatoneProductRepository';
import { GetMegatoneProductsRepository } from '@/src/core/driver/repository/marketplace/megatone/product/get/GetMegatoneProductRepository';

type Params = {
  offset: number;
  limit: number;
  sku?: string;
  status?: 'ACTIVE' | 'ERROR';
};

export async function getMegatoneProductsAction(
  params: Params
): Promise<PaginatedResult<MarketplaceProduct>> {
  const repository: IGetMegatoneProductsRepository =
    new GetMegatoneProductsRepository();

  return repository.execute(params);
}
