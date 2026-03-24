import { IGetHistoricalOrdersOverviewRepository } from '@/src/core/adapters/repository/apiOrders/overview/historical/IGetHistoricalOrdersOverviewRepository';
import { OrdersOverviewResponse } from '@/src/core/adapters/repository/apiOrders/shared/order.types';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';
import { createOrdersApiClient } from '@/src/core/driver/repository/apiOrders/shared/ordersApiClient';

export class GetHistoricalOrdersOverviewRepository
  implements IGetHistoricalOrdersOverviewRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http = createOrdersApiClient(httpClient);
  }

  execute(): Promise<OrdersOverviewResponse> {
    return this.http.get<OrdersOverviewResponse>('/orders/overview/historical');
  }
}
