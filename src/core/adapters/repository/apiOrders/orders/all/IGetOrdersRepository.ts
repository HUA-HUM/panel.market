import {
  OrdersOverviewResponse,
  OrdersRangeFilters
} from '@/src/core/adapters/repository/apiOrders/shared/order.types';

export interface IGetOrdersRepository {
  execute(filters: OrdersRangeFilters): Promise<OrdersOverviewResponse>;
}
