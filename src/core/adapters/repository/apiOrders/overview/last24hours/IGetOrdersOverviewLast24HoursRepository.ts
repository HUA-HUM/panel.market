import { OrdersOverviewResponse } from '@/src/core/adapters/repository/apiOrders/shared/order.types';

export interface IGetOrdersOverviewLast24HoursRepository {
  execute(): Promise<OrdersOverviewResponse>;
}
