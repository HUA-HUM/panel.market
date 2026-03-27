'use client';

import { useEffect, useState } from 'react';
import {
  MarketplaceProductsStatus,
  MarketplaceProductsStatusSummary,
} from '@/src/core/entitis/marketplace/shared/products/status/MarketplaceProductsStatus';

type Params = {
  marketplace: string;
};

type StatusResponse = {
  marketplace?: string;
  total?: number | string;
  statuses?: Array<{
    status: string;
    total: number | string;
    percentage?: number | string;
  }>;
  statusMap?: Record<string, number>;
  statusPercentageMap?: Record<string, number>;
};

export function useMarketplaceProductsStatus({
  marketplace,
}: Params) {
  const [items, setItems] = useState<MarketplaceProductsStatus[]>([]);
  const [summary, setSummary] =
    useState<MarketplaceProductsStatusSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchStatus() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_MADRE_API_URL}/api/internal/marketplace/products/${marketplace}/status`,
          { cache: 'no-store' }
        );

        const data = (await res.json()) as StatusResponse;

        if (!mounted) return;

        const normalizedItems = Array.isArray(data?.statuses)
          ? data.statuses.map(item => ({
              status: item.status,
              total: Number(item.total ?? 0),
              percentage: Number(item.percentage ?? 0),
            }))
          : [];

        setItems(normalizedItems);
        setSummary({
          marketplace: data?.marketplace ?? marketplace,
          total: Number(data?.total ?? 0),
          statuses: normalizedItems,
          statusMap: data?.statusMap ?? {},
          statusPercentageMap: data?.statusPercentageMap ?? {},
        });
      } catch {
        if (!mounted) return;
        setItems([]);
        setSummary(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchStatus();

    return () => {
      mounted = false;
    };
  }, [marketplace]);

  return {
    items,
    summary,
    loading,
  };
}
