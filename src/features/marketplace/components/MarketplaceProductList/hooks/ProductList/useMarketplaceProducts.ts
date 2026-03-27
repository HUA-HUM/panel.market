'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MarketplaceProduct } from '@/src/core/entitis/marketplace/shared/products/get/MarketplaceProduct';
import { MarketplaceProductsListSummary } from '@/src/core/entitis/marketplace/shared/products/get/pagination/PaginatedResult';
import { getFravegaProductsAction } from './actions/getFravegaProducts';
import { getMegatoneProductsAction } from './actions/getMegatoneProducts';
import { getOncityProductsAction } from './actions/getOncityProducts';

const PAGE_SIZE = 10;

type Params = {
  marketplaceId: string;
};

export function useMarketplaceProducts({ marketplaceId }: Params) {
  const [items, setItems] = useState<MarketplaceProduct[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [summary, setSummary] =
    useState<MarketplaceProductsListSummary | null>(null);

  // loaders separados
  const [loading, setLoading] = useState(false); // carga inicial / refresh
  const [paging, setPaging] = useState(false);   // next / prev

  const hasFetchedRef = useRef(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchPage = useCallback(
    async (nextPage: number) => {
      if (loading || paging) return;
      if (nextPage < 1) return;
      if (totalPages && nextPage > totalPages) return;

      const isPaging = nextPage !== page;

      if (isPaging) {
        setPaging(true);
      } else {
        setLoading(true);
      }

      try {
        const offset = (nextPage - 1) * PAGE_SIZE;

        let response;

        if (marketplaceId === 'fravega') {
          response = await getFravegaProductsAction({
            offset,
            limit: PAGE_SIZE,
          });
        } else if (marketplaceId === 'megatone') {
          response = await getMegatoneProductsAction({
            offset,
            limit: PAGE_SIZE,
          });
        } else if (marketplaceId === 'oncity') {
          response = await getOncityProductsAction({
            offset,
            limit: PAGE_SIZE,
          });
        } else {
          throw new Error(`Marketplace no soportado: ${marketplaceId}`);
        }

        setItems(response.items);
        setTotal(response.total);
        setCount(response.count ?? response.items.length);
        setSummary(response.summary ?? null);
        setPage(nextPage);
      } catch {
      } finally {
        setLoading(false);
        setPaging(false);
      }
    },
    [marketplaceId, page, totalPages, loading, paging]
  );

  // carga inicial (una sola vez por marketplace)
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [marketplaceId]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    fetchPage(1);
  }, [fetchPage]);

  return {
    items,
    page,
    total,
    count,
    summary,
    totalPages,

    // estados
    loading,
    paging,

    // acciones
    fetchNext: () => fetchPage(page + 1),
    fetchPrev: () => fetchPage(page - 1),
    refresh: () => fetchPage(page),
  };
}
