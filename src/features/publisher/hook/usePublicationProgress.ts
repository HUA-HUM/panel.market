'use client';

import { useCallback, useEffect, useState } from 'react';
import { PendingPublicationJob } from '@/src/core/adapters/repository/apiProducts/progress/IGetPendingPublicationJobsRepository';
import { PublicationRunJob } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunJobsRepository';
import { PublicationRun } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunRepository';
import { PublicationRunProgress } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunProgressRepository';
import { GetPendingPublicationJobsRepository } from '@/src/core/driver/repository/apiProducts/GetPendingPublicationJobsRepository';
import { GetPublicationRunJobsRepository } from '@/src/core/driver/repository/apiProducts/GetPublicationRunJobsRepository';
import { GetPublicationRunProgressRepository } from '@/src/core/driver/repository/apiProducts/GetPublicationRunProgressRepository';
import { GetPublicationRunRepository } from '@/src/core/driver/repository/apiProducts/GetPublicationRunRepository';

type UsePublicationProgressOptions = {
  initialRunId?: string | null;
};

function normalizeRunId(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return '';
}

function normalizeCollection<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (
    value &&
    typeof value === 'object' &&
    'items' in value &&
    Array.isArray(value.items)
  ) {
    return value.items as T[];
  }

  return [];
}

export function usePublicationProgress(options?: UsePublicationProgressOptions) {
  const [runId, setRunId] = useState(normalizeRunId(options?.initialRunId));
  const [run, setRun] = useState<PublicationRun | null>(null);
  const [progress, setProgress] = useState<PublicationRunProgress | null>(null);
  const [pendingJobs, setPendingJobs] = useState<PendingPublicationJob[]>([]);
  const [runJobs, setRunJobs] = useState<PublicationRunJob[]>([]);
  const [activeRuns, setActiveRuns] = useState<PublicationRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (nextRunId?: string) => {
    const requestedRunId = normalizeRunId(nextRunId ?? runId);

    const runRepository = new GetPublicationRunRepository();
    const progressRepository = new GetPublicationRunProgressRepository();
    const pendingJobsRepository = new GetPendingPublicationJobsRepository();
    const runJobsRepository = new GetPublicationRunJobsRepository();

    setLoading(true);
    setError(null);

    try {
      const pendingJobsResponse = normalizeCollection<PendingPublicationJob>(
        await pendingJobsRepository.execute(50)
      );
      setPendingJobs(pendingJobsResponse);

      const uniquePendingRunIds = Array.from(
        new Set(pendingJobsResponse.map((job) => normalizeRunId(job.run_id)).filter(Boolean))
      );

      if (uniquePendingRunIds.length > 0) {
        const activeRunsResponse = await Promise.all(
          uniquePendingRunIds.map((currentRunId) => runRepository.execute(currentRunId))
        );
        const sortedActiveRuns = [...activeRunsResponse].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setActiveRuns(sortedActiveRuns);

        const autoSelectedRunId =
          requestedRunId || sortedActiveRuns[0]?.id || '';

        if (!requestedRunId && autoSelectedRunId) {
          setRunId(autoSelectedRunId);
        }

        if (!autoSelectedRunId) {
          setRun(null);
          setProgress(null);
          setRunJobs([]);
          return;
        }

        const [runResponse, progressResponse, runJobsResponse] = await Promise.all([
          runRepository.execute(autoSelectedRunId),
          progressRepository.execute(autoSelectedRunId),
          runJobsRepository.execute({
            runId: autoSelectedRunId,
            limit: 50,
            offset: 0,
          }),
        ]);

        setRun(runResponse);
        setProgress(progressResponse);
        setRunJobs(normalizeCollection<PublicationRunJob>(runJobsResponse));
      } else {
        setActiveRuns([]);
        setRun(null);
        setProgress(null);
        setRunJobs([]);
      }
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

    setRunId(normalizeRunId(options.initialRunId));
  }, [options?.initialRunId]);

  useEffect(() => {
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
    runJobs,
    activeRuns,
    loading,
    error,
    refresh,
  };
}
