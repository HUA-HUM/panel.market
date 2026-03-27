'use client';

import { useCallback, useState } from 'react';
import { runImportProductsAction, RunImportStatus } from './actions/runImportProducts';


type Params = {
  marketplace: 'megatone' | 'oncity' | 'fravega';
};

export function useRunImportProducts({ marketplace }: Params) {
  const [status, setStatus] = useState<RunImportStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runImport = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await runImportProductsAction({
        marketplace,
      });

      setStatus(response.status);
    } catch {
      setStatus('FAILED');
      setError('Error ejecutando el import');
    } finally {
      setLoading(false);
    }
  }, [marketplace, loading]);

  return {
    runImport,
    status,
    loading,
    error,
    isRunning: loading || status === 'STARTED' || status === 'QUEUED',
  };
}
