import { OrdersOverviewResponse } from '@/src/core/adapters/repository/apiOrders/shared/order.types';

export interface IGetHistoricalOrdersOverviewRepository {
  execute(): Promise<OrdersOverviewResponse>;
}
