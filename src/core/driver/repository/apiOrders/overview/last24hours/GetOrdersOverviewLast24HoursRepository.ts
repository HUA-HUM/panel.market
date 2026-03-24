import { IGetOrdersOverviewLast24HoursRepository } from '@/src/core/adapters/repository/apiOrders/overview/last24hours/IGetOrdersOverviewLast24HoursRepository';
import { OrdersOverviewResponse } from '@/src/core/adapters/repository/apiOrders/shared/order.types';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';
import { createOrdersApiClient } from '@/src/core/driver/repository/apiOrders/shared/ordersApiClient';

export class GetOrdersOverviewLast24HoursRepository
  implements IGetOrdersOverviewLast24HoursRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http = createOrdersApiClient(httpClient);
  }

  execute(): Promise<OrdersOverviewResponse> {
    return this.http.get<OrdersOverviewResponse>('/orders/overview/last-24-hours');
  }
}
