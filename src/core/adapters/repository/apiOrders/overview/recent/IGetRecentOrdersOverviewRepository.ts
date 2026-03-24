import { OrdersOverviewResponse } from '@/src/core/adapters/repository/apiOrders/shared/order.types';

export type RecentOrdersHours = 24 | 48 | 72;

export interface IGetRecentOrdersOverviewRepository {
  execute(hours: RecentOrdersHours): Promise<OrdersOverviewResponse>;
}
