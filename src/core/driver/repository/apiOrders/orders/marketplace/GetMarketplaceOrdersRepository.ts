import { IGetMarketplaceOrdersRepository } from '@/src/core/adapters/repository/apiOrders/orders/marketplace/IGetMarketplaceOrdersRepository';
import {
  MarketplaceOrdersResponse,
  OrderMarketplace,
  OrdersRangeFilters
} from '@/src/core/adapters/repository/apiOrders/shared/order.types';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';
import {
  buildOrdersRangeQuery,
  createOrdersApiClient
} from '@/src/core/driver/repository/apiOrders/shared/ordersApiClient';

export class GetMarketplaceOrdersRepository
  implements IGetMarketplaceOrdersRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http = createOrdersApiClient(httpClient);
  }

  execute(
    marketplace: OrderMarketplace,
    filters: OrdersRangeFilters
  ): Promise<MarketplaceOrdersResponse> {
    const query = buildOrdersRangeQuery(filters.from, filters.to);
    return this.http.get<MarketplaceOrdersResponse>(
      `/orders/${marketplace}?${query}`
    );
  }
}
