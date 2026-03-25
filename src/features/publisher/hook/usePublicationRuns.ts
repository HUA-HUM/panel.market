'use client';

import { useCallback, useEffect, useState } from 'react';
import { PublicationRun } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunRepository';
import { GetPublicationRunsRepository } from '@/src/core/driver/repository/apiProducts/GetPublicationRunsRepository';

export function usePublicationRuns() {
  const [runs, setRuns] = useState<PublicationRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const repository = new GetPublicationRunsRepository();
      const response = await repository.execute();
      const sortedRuns = [...response].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRuns(sortedRuns);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load publication runs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    runs,
    loading,
    error,
    refresh,
  };
}
