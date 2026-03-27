'use client';

import { useEffect, useState } from 'react';
import { ProductImportRun } from '@/src/core/entitis/marketplace/shared/import/get/ProductImportRun';
import { IGetProductImportRunsRepository } from '@/src/core/adapters/repository/marketplace/shared/import/get/IGetProductImportRunsRepository';
import { GetProductSyncRunsRepository } from '@/src/core/driver/repository/marketplace/shared/imports/get/GetProductImportRunsRepository';

type Params = {
  marketplace: 'megatone' | 'oncity' | 'fravega';
};

export function useProductImportRuns({ marketplace }: Params) {
  const [runs, setRuns] = useState<ProductImportRun[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const repository: IGetProductImportRunsRepository =
      new GetProductSyncRunsRepository();

    const fetchRuns = async () => {
      setLoading(true);

      try {
        const result = await repository.execute({
          marketplace,
          offset: 0,
          limit: 20,
        });

        const sortedRuns = [...(result.items ?? [])].sort(
          (a, b) =>
            new Date(b.started_at).getTime() -
            new Date(a.started_at).getTime()
        );

        setRuns(sortedRuns);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
    const interval = setInterval(fetchRuns, 10_000);

    return () => clearInterval(interval);
  }, [marketplace]);

  return {
    runs,
    latestRun: runs[0] ?? null,
    loading,
    isRunning: runs[0]?.status === 'STARTED',
  };
}
