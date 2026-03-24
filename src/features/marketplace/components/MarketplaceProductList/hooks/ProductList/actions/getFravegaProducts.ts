'use server';

import { IGetFravegaProductsRepository } from '@/src/core/adapters/repository/marketplace/fravega/products/get/IGetFravegaProductRepository';
import { GetFravegaProductsRepository } from '@/src/core/driver/repository/marketplace/fravega/product/get/GetFravegaProductRepository';

type Params = {
  offset: number;
  limit: number;
};

export async function getFravegaProductsAction(params: Params) {
  const repository: IGetFravegaProductsRepository =
    new GetFravegaProductsRepository();

  return repository.execute(params);
}
