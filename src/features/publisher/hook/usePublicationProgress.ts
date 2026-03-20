'use client';

import { useCallback, useEffect, useState } from 'react';
import { PendingPublicationJob } from '@/src/core/adapters/repository/apiProducts/progress/IGetPendingPublicationJobsRepository';
import { PublicationRun } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunRepository';
import { PublicationRunProgress } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunProgressRepository';
import { GetPendingPublicationJobsRepository } from '@/src/core/driver/repository/apiProducts/GetPendingPublicationJobsRepository';
import { GetPublicationRunProgressRepository } from '@/src/core/driver/repository/apiProducts/GetPublicationRunProgressRepository';
import { GetPublicationRunRepository } from '@/src/core/driver/repository/apiProducts/GetPublicationRunRepository';

type UsePublicationProgressOptions = {
  initialRunId?: string | null;
};

export function usePublicationProgress(options?: UsePublicationProgressOptions) {
  const [runId, setRunId] = useState(options?.initialRunId ?? '');
  const [run, setRun] = useState<PublicationRun | null>(null);
  const [progress, setProgress] = useState<PublicationRunProgress | null>(null);
  const [pendingJobs, setPendingJobs] = useState<PendingPublicationJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (nextRunId?: string) => {
    const resolvedRunId = (nextRunId ?? runId).trim();

    if (!resolvedRunId) {
      setRun(null);
      setProgress(null);
      setPendingJobs([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const runRepository = new GetPublicationRunRepository();
    const progressRepository = new GetPublicationRunProgressRepository();
    const pendingJobsRepository = new GetPendingPublicationJobsRepository();

    try {
      const [runResponse, progressResponse, pendingJobsResponse] = await Promise.all([
        runRepository.execute(resolvedRunId),
        progressRepository.execute(resolvedRunId),
        pendingJobsRepository.execute(10)
      ]);

      setRun(runResponse);
      setProgress(progressResponse);
      setPendingJobs(
        pendingJobsResponse.filter((job) => job.run_id === resolvedRunId)
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo obtener el progreso de la publicación.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [runId]);

  useEffect(() => {
    if (!options?.initialRunId) {
      return;
    }

    setRunId(options.initialRunId);
  }, [options?.initialRunId]);

  useEffect(() => {
    if (!runId) {
      return;
    }

    void refresh(runId);

    const interval = window.setInterval(() => {
      void refresh(runId);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [refresh, runId]);

  return {
    runId,
    setRunId,
    run,
    progress,
    pendingJobs,
    loading,
    error,
    refresh,
  };
}
