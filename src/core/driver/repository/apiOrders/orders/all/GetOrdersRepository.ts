import { IGetOrdersRepository } from '@/src/core/adapters/repository/apiOrders/orders/all/IGetOrdersRepository';
import {
  OrdersOverviewResponse,
  OrdersRangeFilters
} from '@/src/core/adapters/repository/apiOrders/shared/order.types';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';
import {
  buildOrdersRangeQuery,
  createOrdersApiClient
} from '@/src/core/driver/repository/apiOrders/shared/ordersApiClient';

export class GetOrdersRepository implements IGetOrdersRepository {
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http = createOrdersApiClient(httpClient);
  }

  execute(filters: OrdersRangeFilters): Promise<OrdersOverviewResponse> {
    const query = buildOrdersRangeQuery(filters.from, filters.to);
    return this.http.get<OrdersOverviewResponse>(`/orders?${query}`);
  }
}
