'use client';

import { useEffect, useState } from 'react';
import { GetFoldersRepository } from '@/src/core/driver/repository/madre/analitics/favorites/folders/get/GetFoldersRepository';
import { Marketplace } from '@/src/core/entitis/madre/analitics/favorites/folder/status/marketplace.types';

export function useFolders() {
  const [folders, setFolders] = useState<Marketplace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = new GetFoldersRepository();

  const fetchFolders = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await repository.execute();
      setFolders(data);
    } catch (err: any) {
      console.error('[GET_FOLDERS_ERROR]', err);
      setError(err?.message || 'Error obteniendo carpetas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return {
    folders,
    loading,
    error,
    refetch: fetchFolders
  };
}