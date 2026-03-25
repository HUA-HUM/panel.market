'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MarketplaceProductPresence,
} from '@/src/core/adapters/repository/madre/products/IGetMarketplaceProductBySkuRepository';
import { GetMarketplaceProductBySkuRepository } from '@/src/core/driver/repository/madre/products/GetMarketplaceProductBySkuRepository';
import { GetMarketplaceProductsRepository } from '@/src/core/driver/repository/madre/products/GetMarketplaceProductsRepository';

const PAGE_SIZE = 10;

export function useMarketplaceCatalog() {
  const [items, setItems] = useState<MarketplaceProductPresence[]>([]);
  const [selectedSku, setSelectedSku] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProductPresence | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchPage = useCallback(async (nextPage = 1) => {
    setLoading(true);
    setError(null);

    try {
      const offset = (nextPage - 1) * PAGE_SIZE;
      const repository = new GetMarketplaceProductsRepository();
      const response = await repository.execute({
        offset,
        limit: PAGE_SIZE,
      });

      setItems(response.items);
      setTotal(response.total);
      setPage(nextPage);

      if (!selectedSku && response.items[0]) {
        setSelectedSku(response.items[0].sellerSku);
        setSelectedProduct(response.items[0]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  }, [selectedSku]);

  const fetchProduct = useCallback(async (sellerSku: string) => {
    const normalizedSku = sellerSku.trim();

    if (!normalizedSku) {
      return;
    }

    setDetailLoading(true);
    setError(null);

    try {
      const repository = new GetMarketplaceProductBySkuRepository();
      const response = await repository.execute(normalizedSku);
      setSelectedSku(response.sellerSku);
      setSelectedProduct(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load the selected SKU.');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPage(1);
  }, [fetchPage]);

  const marketplaceTotals = useMemo(() => {
    return items.reduce<Record<string, number>>((acc, item) => {
      item.marketplaces.forEach((marketplace) => {
        acc[marketplace] = (acc[marketplace] ?? 0) + 1;
      });

      return acc;
    }, {});
  }, [items]);

  return {
    items,
    selectedSku,
    selectedProduct,
    page,
    total,
    totalPages,
    loading,
    detailLoading,
    error,
    marketplaceTotals,
    setSelectedSku,
    fetchPage,
    fetchProduct,
    selectProductFromList: (product: MarketplaceProductPresence) => {
      setSelectedSku(product.sellerSku);
      setSelectedProduct(product);
      void fetchProduct(product.sellerSku);
    },
  };
}
