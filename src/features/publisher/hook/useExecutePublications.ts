'use client';

import { ExecutePublicationsRepository } from '@/src/core/driver/repository/apiProducts/ExecutePublicationsRepository';
import { useState } from 'react';

type ExecutePayload = {
  marketplaces: string[];
  folderId: number;
};

export function useExecutePublications() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = new ExecutePublicationsRepository();

  const execute = async (data: ExecutePayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await repository.execute(data);
      return response;
    } catch (err: any) {
      console.error('[EXECUTE_PUBLICATIONS_ERROR]', err);
      setError(err?.message || 'Error ejecutando publicaciones');
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