'use client';

import { useCallback, useEffect, useState } from 'react';
import { GetHistoricalOrdersOverviewRepository } from '@/src/core/driver/repository/apiOrders/overview/historical/GetHistoricalOrdersOverviewRepository';
import { GetOrdersOverviewLast24HoursRepository } from '@/src/core/driver/repository/apiOrders/overview/last24hours/GetOrdersOverviewLast24HoursRepository';
import { GetRecentOrdersOverviewRepository } from '@/src/core/driver/repository/apiOrders/overview/recent/GetRecentOrdersOverviewRepository';
import { GetMarketplaceOrdersRepository } from '@/src/core/driver/repository/apiOrders/orders/marketplace/GetMarketplaceOrdersRepository';
import { GetOrdersRepository } from '@/src/core/driver/repository/apiOrders/orders/all/GetOrdersRepository';
import {
  MarketplaceOrdersResponse,
  OrderMarketplace,
  OrderMarketplaceTotal,
  OrdersOverviewResponse,
  OrdersRangeFilters
} from '@/src/core/adapters/repository/apiOrders/shared/order.types';

export type OrdersPreset = 'last24' | 24 | 48 | 72 | 'historical' | 'custom';
export type OrdersMarketplaceFilter = 'all' | OrderMarketplace;

const DEFAULT_MARKETPLACES: OrderMarketplace[] = ['fravega', 'megatone', 'oncity'];

function normalizeMarketplaceResponse(
  response: MarketplaceOrdersResponse
): OrdersOverviewResponse {
  const marketplaces: OrderMarketplaceTotal[] = DEFAULT_MARKETPLACES.map((marketplace) => ({
    marketplace,
    total: marketplace === response.marketplace ? response.total : 0,
  }));

  return {
    range: response.range,
    total: response.total,
    marketplaces,
    items: response.items,
    errors: [],
  };
}

export function useOrdersDashboard() {
  const [data, setData] = useState<OrdersOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<OrdersPreset>('last24');

  const fetchLast24Hours = useCallback(async () => {
    setLoading(true);
    setError(null);
    setActivePreset('last24');

    try {
      const repository = new GetOrdersOverviewLast24HoursRepository();
      const response = await repository.execute();
      setData(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load order overview.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecent = useCallback(async (hours: 24 | 48 | 72) => {
    setLoading(true);
    setError(null);
    setActivePreset(hours);

    try {
      const repository = new GetRecentOrdersOverviewRepository();
      const response = await repository.execute(hours);
      setData(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load recent orders overview.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistorical = useCallback(async () => {
    setLoading(true);
    setError(null);
    setActivePreset('historical');

    try {
      const repository = new GetHistoricalOrdersOverviewRepository();
      const response = await repository.execute();
      setData(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load historical orders overview.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByRange = useCallback(
    async (filters: OrdersRangeFilters, marketplace: OrdersMarketplaceFilter) => {
      setLoading(true);
      setError(null);
      setActivePreset('custom');

      try {
        if (marketplace === 'all') {
          const repository = new GetOrdersRepository();
          const response = await repository.execute(filters);
          setData(response);
        } else {
          const repository = new GetMarketplaceOrdersRepository();
          const response = await repository.execute(marketplace, filters);
          setData(normalizeMarketplaceResponse(response));
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unable to load orders for the selected range.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void fetchLast24Hours();
  }, [fetchLast24Hours]);

  return {
    data,
    loading,
    error,
    activePreset,
    fetchLast24Hours,
    fetchRecent,
    fetchHistorical,
    fetchByRange,
  };
}
