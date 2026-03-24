import {
  IGetRecentOrdersOverviewRepository,
  RecentOrdersHours
} from '@/src/core/adapters/repository/apiOrders/overview/recent/IGetRecentOrdersOverviewRepository';
import { OrdersOverviewResponse } from '@/src/core/adapters/repository/apiOrders/shared/order.types';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';
import { createOrdersApiClient } from '@/src/core/driver/repository/apiOrders/shared/ordersApiClient';

export class GetRecentOrdersOverviewRepository
  implements IGetRecentOrdersOverviewRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http = createOrdersApiClient(httpClient);
  }

  execute(hours: RecentOrdersHours): Promise<OrdersOverviewResponse> {
    return this.http.get<OrdersOverviewResponse>(`/orders/overview/recent/${hours}`);
  }
}
