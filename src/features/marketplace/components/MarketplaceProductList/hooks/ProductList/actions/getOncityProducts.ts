// actions/getOncityProducts.ts
'use server';

import { IGetOncityProductsRepository } from '@/src/core/adapters/repository/marketplace/oncity/products/get/IGetOncityProductRepository';
import { GetOncityProductsRepository } from '@/src/core/driver/repository/marketplace/oncity/product/get/GetOncityProductRepository';

type Params = {
  offset: number;
  limit: number;
  sku?: string;
  status?: 'ACTIVE' | 'ERROR';
};

export async function getOncityProductsAction(params: Params) {
  const repo: IGetOncityProductsRepository =
    new GetOncityProductsRepository();

  return repo.execute(params);
}
