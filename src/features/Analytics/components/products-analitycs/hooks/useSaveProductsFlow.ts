'use client';

import { useState } from 'react';
import { ProductsFilters } from '@/src/core/entitis/madre/analitics/products-analitycs/ProductsFilters';
import { ISaveSelectionRepository } from '@/src/core/adapters/repository/madre/analitics/products-analitycs/saveproducts/ISaveSelectionRepository';
import { ISaveSegmentRepository } from '@/src/core/adapters/repository/madre/analitics/products-analitycs/segments/ISaveSegmentRepository';

export function useSaveProductsFlow(
  saveSelectionRepo: ISaveSelectionRepository,
  saveSegmentRepo: ISaveSegmentRepository
) {
  const [loading, setLoading] = useState(false);

  const execute = async (
    marketplaceId: number,
    filters: ProductsFilters
  ) => {
    try {
      setLoading(true);

      console.log('[useSaveProductsFlow] Save flow payload', {
        marketplaceId,
        filters,
      });

      const selectionResult =
        await saveSelectionRepo.execute(marketplaceId, filters);

      const segmentResult =
        await saveSegmentRepo.execute(marketplaceId, filters);

      console.log('[useSaveProductsFlow] Save flow responses', {
        selectionResult,
        segmentResult,
      });

      return {
        selectionResult,
        segmentResult,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
  };
}
