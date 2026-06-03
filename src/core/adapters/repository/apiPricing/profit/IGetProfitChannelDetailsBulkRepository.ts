import {
  PricingBulkItemInput,
  PricingBulkResponse,
} from '@/src/core/adapters/repository/apiPricing/shared/pricing.types';

export interface IGetProfitChannelDetailsBulkRepository {
  execute(params: {
    items: PricingBulkItemInput[];
    page?: number;
    perPage?: number;
  }): Promise<PricingBulkResponse>;
}
