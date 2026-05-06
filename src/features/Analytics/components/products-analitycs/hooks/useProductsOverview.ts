'use client';

import { GetProductsOverviewRepository } from '@/src/core/driver/repository/madre/analitics/products-analitycs/products/GetProductsOverviewRepository';
import { ProductsFilters } from '@/src/core/entitis/madre/analitics/products-analitycs/ProductsFilters';
import { ProductsOverview } from '@/src/core/entitis/madre/analitics/products-analitycs/ProductsOverview';
import { useState, useCallback } from 'react';

export function useProductsOverview() {
  const [data, setData] = useState<ProductsOverview | null>(null);
  const [loading, setLoading] = useState(false);

  const repository = new GetProductsOverviewRepository();

  const execute = async (filters: ProductsFilters) => {
    try {
      setLoading(true);
      console.log('[useProductsOverview] Request filters', filters);
      const response = await repository.execute(filters);
      console.log('[useProductsOverview] Response overview', response);
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    execute
  };
}
