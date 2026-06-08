'use server';

import { IGetGoogleMerchantProductsRepository } from '@/src/core/adapters/repository/marketplace/google-merchant/products/get/IGetGoogleMerchantProductRepository';
import { GetGoogleMerchantProductsRepository } from '@/src/core/driver/repository/marketplace/google-merchant/product/get/GetGoogleMerchantProductRepository';

type Params = {
  offset: number;
  limit: number;
  sku?: string;
  status?: 'ACTIVE' | 'ERROR';
};

export async function getGoogleMerchantProductsAction(params: Params) {
  const repository: IGetGoogleMerchantProductsRepository =
    new GetGoogleMerchantProductsRepository();

  return repository.execute(params);
}
