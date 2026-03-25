'use client';

import { useEffect, useState } from 'react';
import { PublicationRunJob } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunJobsRepository';
import { PublicationRun } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunRepository';
import { GetPublicationRunJobsRepository } from '@/src/core/driver/repository/apiProducts/GetPublicationRunJobsRepository';
import { usePublicationRuns } from '@/src/features/publisher/hook/usePublicationRuns';

type PublicationJobsPanelProps = {
  activeRunId?: string | null;
  onSelectRun?: (runId: string) => void;
};

function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getReason(job: PublicationRunJob) {
  if (
    job.request_payload &&
    typeof job.request_payload === 'object' &&
    'reason' in job.request_payload
  ) {
    return String(job.request_payload.reason);
  }

  return job.error_message || job.result || 'No detail';
}

function getStatusTone(status: string) {
  switch (status.toLowerCase()) {
    case 'success':
      return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100';
    case 'skipped':
      return 'border-amber-400/20 bg-amber-400/10 text-amber-100';
    case 'failed':
      return 'border-rose-400/20 bg-rose-400/10 text-rose-100';
    case 'pending':
      return 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100';
    default:
      return 'border-white/10 bg-white/[0.04] text-zinc-200';
  }
}

export function PublicationJobsPanel({
  activeRunId,
  onSelectRun,
}: PublicationJobsPanelProps) {
  const { runs, loading, error, refresh } = usePublicationRuns();
  const [jobsByRun, setJobsByRun] = useState<Record<string, PublicationRunJob[]>>({});
  const [loadingRuns, setLoadingRuns] = useState<string[]>([]);

  useEffect(() => {
    const candidateRuns = runs.slice(0, 8);

    candidateRuns.forEach((run) => {
      if (jobsByRun[run.id]) {
        return;
      }

      setLoadingRuns((current) => [...current, run.id]);

      const repository = new GetPublicationRunJobsRepository();
      void repository.execute({
        runId: run.id,
        limit: 50,
        offset: 0,
      }).then((response) => {
        const normalizedResponse = response as unknown;
        const jobs = Array.isArray(normalizedResponse)
          ? normalizedResponse
          : normalizedResponse &&
              typeof normalizedResponse === 'object' &&
              'items' in normalizedResponse &&
              Array.isArray(normalizedResponse.items)
            ? normalizedResponse.items as PublicationRunJob[]
            : [];

        setJobsByRun((current) => ({
          ...current,
          [run.id]: jobs,
        }));
      }).finally(() => {
        setLoadingRuns((current) => current.filter((id) => id !== run.id));
      });
    });
  }, [jobsByRun, runs]);

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
            Jobs
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            SKUs by run
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Each run as a card, with the SKU jobs inside and their real status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
        >
          Refresh
        </button>
      </section>

      {error && (
        <section className="rounded-[24px] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          {error}
        </section>
      )}

      <section className="space-y-5">
        {runs.map((run) => (
          <RunJobsCard
            key={run.id}
            run={run}
            jobs={jobsByRun[run.id] ?? []}
            selected={activeRunId === run.id}
            loading={loadingRuns.includes(run.id)}
            onSelectRun={onSelectRun}
          />
        ))}

        {!loading && runs.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-sm text-zinc-500">
            No runs available to load jobs.
          </div>
        )}
      </section>
    </div>
  );
}

function RunJobsCard({
  run,
  jobs,
  selected,
  loading,
  onSelectRun,
}: {
  run: PublicationRun;
  jobs: PublicationRunJob[];
  selected: boolean;
  loading: boolean;
  onSelectRun?: (runId: string) => void;
}) {
  return (
    <div className={`rounded-[24px] border p-5 ${selected ? 'border-cyan-300/25 bg-[linear-gradient(135deg,rgba(103,232,249,0.14),rgba(37,99,235,0.18))]' : 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]'}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-white">Run #{run.id}</p>
          <p className="mt-1 text-sm text-zinc-400">{run.marketplaces.join(', ')}</p>
        </div>
        <button
          type="button"
          onClick={() => onSelectRun?.(run.id)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300"
        >
          Use this run
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <div className="max-h-[340px] overflow-y-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="sticky top-0 bg-[#0d1527] text-zinc-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">SKU</th>
                <th className="px-4 py-3 text-left font-medium">Marketplace</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Reason</th>
                <th className="px-4 py-3 text-left font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-black/10 text-zinc-200">
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-4 py-3 font-mono text-xs">{job.sku}</td>
                  <td className="px-4 py-3 capitalize">{job.marketplace}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-xs ${getStatusTone(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-300">{getReason(job)}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{formatDate(job.updated_at)}</td>
                </tr>
              ))}

              {!loading && jobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                    No jobs were returned for this run.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                    Loading jobs...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
