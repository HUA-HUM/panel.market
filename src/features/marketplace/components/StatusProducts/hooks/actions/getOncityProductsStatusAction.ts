'use server';

import { IGetOncityProductsStatusRepository } from '@/src/core/adapters/repository/marketplace/oncity/products/status/IGetOncityProductsStatusRepository';
import { StatusOncityProductRepository } from '@/src/core/driver/repository/marketplace/oncity/product/status/StatusOncityProductRepository';

export async function getOncityProductsStatusAction(params?: {
  status?: 'ACTIVE' | 'PAUSED' | 'PENDING' | 'DELETED';
}) {
  const repo: IGetOncityProductsStatusRepository =
    new StatusOncityProductRepository();

  return repo.execute(params);
}
