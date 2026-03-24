import {
  MarketplaceOrdersResponse,
  OrderMarketplace,
  OrdersRangeFilters
} from '@/src/core/adapters/repository/apiOrders/shared/order.types';

export interface IGetMarketplaceOrdersRepository {
  execute(
    marketplace: OrderMarketplace,
    filters: OrdersRangeFilters
  ): Promise<MarketplaceOrdersResponse>;
}
