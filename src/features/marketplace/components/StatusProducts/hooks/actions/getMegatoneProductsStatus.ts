'use server';

import { IGetMegatoneProductsStatusRepository } from '@/src/core/adapters/repository/marketplace/megatone/products/status/IGetMegatoneProductsStatusRepository';
import { StatusMegatoneProductRepository } from '@/src/core/driver/repository/marketplace/megatone/product/status/StatusMegatoneProductRepository';

export async function getMegatoneProductsStatusAction(params?: {
  status?: 'ACTIVE' | 'PAUSED' | 'PENDING' | 'DELETED';
}) {
  const repo: IGetMegatoneProductsStatusRepository =
    new StatusMegatoneProductRepository();

  return repo.execute(params);
}
