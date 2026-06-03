import { IGetProfitChannelDetailsBulkRepository } from '@/src/core/adapters/repository/apiPricing/profit/IGetProfitChannelDetailsBulkRepository';
import {
  PricingBulkResponse,
  PricingBulkItemInput,
} from '@/src/core/adapters/repository/apiPricing/shared/pricing.types';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';

export class GetProfitChannelDetailsBulkRepository
  implements IGetProfitChannelDetailsBulkRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: '/api',
      });
  }

  execute(params: {
    items: PricingBulkItemInput[];
    page?: number;
    perPage?: number;
  }): Promise<PricingBulkResponse> {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? Math.max(params.items.length, 1);

    return this.http.post<PricingBulkResponse>(
      `/pricing/profit/channel/details/bulk?page=${page}&perPage=${perPage}`,
      params.items
    );
  }
}
