'use client';

import { ExecutePublicationsRepository } from '@/src/core/driver/repository/apiProducts/ExecutePublicationsRepository';
import { useState } from 'react';

type ExecutePayload = {
  marketplaces: string[];
  folderId: number;
};

export type ExecutePublicationsResponse = {
  message: string;
  runId: string;
  totalSkus: number;
  totalJobs: number;
};

export function useExecutePublications() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = new ExecutePublicationsRepository();

  const execute = async (data: ExecutePayload): Promise<ExecutePublicationsResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await repository.execute(data);
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error ejecutando publicaciones';
      console.error('[EXECUTE_PUBLICATIONS_ERROR]', err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error
  };
}
