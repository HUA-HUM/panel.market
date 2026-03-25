'use client';

import { FormEvent, useMemo, useState } from 'react';
import { PublicationRunJob } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunJobsRepository';
import { PublicationRun } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunRepository';
import { usePublicationProgress } from '../hook/usePublicationProgress';

type PublicationProgressPanelProps = {
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

function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function toNumber(value: string | number | null | undefined) {
  return Number(value ?? '0');
}

function getJobReason(job: PublicationRunJob) {
  const requestReason =
    job.request_payload &&
    typeof job.request_payload === 'object' &&
    'reason' in job.request_payload
      ? String(job.request_payload.reason)
      : null;

  return requestReason || job.error_message || job.result || 'No detail';
}

function getStatusTone(status: string) {
  switch (status.toLowerCase()) {
    case 'success':
    case 'completed':
    case 'completed with skips':
      return 'text-emerald-300 bg-emerald-400/10 border-emerald-400/15';
    case 'failed':
    case 'completed with failures':
      return 'text-rose-300 bg-rose-400/10 border-rose-400/15';
    case 'skipped':
      return 'text-amber-300 bg-amber-400/10 border-amber-400/15';
    case 'pending':
      return 'text-cyan-200 bg-cyan-400/10 border-cyan-400/15';
    case 'processing':
    case 'running':
      return 'text-sky-200 bg-sky-400/10 border-sky-400/15';
    default:
      return 'text-zinc-300 bg-white/[0.05] border-white/10';
  }
}

function getRunMetrics(run: PublicationRun | null, progress: ReturnType<typeof usePublicationProgress>['progress']) {
  if (!run) {
    return null;
  }

  const total = toNumber(run.total_jobs ?? progress?.total);
  const success = toNumber(run.actual_success_jobs ?? progress?.success ?? run.success_jobs);
  const failed = toNumber(run.actual_failed_jobs ?? progress?.failed ?? run.failed_jobs);
  const skipped = toNumber(run.skipped_jobs ?? progress?.skipped);
  const cancelled = toNumber(run.cancelled_jobs ?? progress?.cancelled);
  const pending = toNumber(run.pending_jobs ?? progress?.pending);
  const processing = toNumber(run.processing_jobs ?? progress?.processing);
  const retry = toNumber(run.retry_jobs);
  const classifiedCompleted = success + failed + skipped + cancelled;
  const settled = Math.max(classifiedCompleted, total - pending - processing);
  const unknown = Math.max(0, settled - classifiedCompleted);
  const completion = total > 0 ? Math.round((settled / total) * 100) : 0;

  return {
    total,
    success,
    failed,
    skipped,
    cancelled,
    pending,
    processing,
    retry,
    classifiedCompleted,
    settled,
    unknown,
    completion,
  };
}

function getDerivedRunStatus(
  run: PublicationRun,
  metrics: NonNullable<ReturnType<typeof getRunMetrics>>
) {
  if (metrics.processing > 0) {
    return 'processing';
  }

  if (metrics.pending > 0) {
    return 'pending';
  }

  if (metrics.failed > 0 && metrics.settled >= metrics.total) {
    return 'completed with failures';
  }

  if (metrics.skipped > 0 && metrics.settled >= metrics.total) {
    return 'completed with skips';
  }

  if (metrics.settled >= metrics.total) {
    return 'completed';
  }

  return run.status;
}

function MetricCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  hint: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const toneClass = {
    default: 'text-white',
    success: 'text-emerald-300',
    warning: 'text-amber-300',
    danger: 'text-rose-300',
  }[tone];

  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className={`mt-3 text-2xl font-semibold ${toneClass}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-400">
        {hint}
      </p>
    </div>
  );
}

export function PublicationProgressPanel({
  initialRunId,
}: PublicationProgressPanelProps) {
  const {
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
  } = usePublicationProgress({ initialRunId });
  const [draftRunId, setDraftRunId] = useState(normalizeRunId(initialRunId));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextRunId = normalizeRunId(draftRunId);
    setRunId(nextRunId);
    await refresh(nextRunId);
  };

  const runMetrics = useMemo(() => getRunMetrics(run, progress), [run, progress]);
  const derivedStatus = useMemo(
    () => (run && runMetrics ? getDerivedRunStatus(run, runMetrics) : 'idle'),
    [run, runMetrics]
  );

  const reasonSummary = useMemo(() => {
    const grouped = new Map<string, number>();

    runJobs.forEach((job) => {
      if (job.status === 'success') {
        return;
      }

      const reason = getJobReason(job);
      grouped.set(reason, (grouped.get(reason) ?? 0) + 1);
    });

    return Array.from(grouped.entries())
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [runJobs]);

  const pendingRunIds = useMemo(
    () => Array.from(new Set(pendingJobs.map((job) => normalizeRunId(job.run_id)).filter(Boolean))),
    [pendingJobs]
  );

  return (
    <div
      className="
        relative overflow-hidden rounded-[28px] border border-white/10
        bg-[linear-gradient(145deg,rgba(8,12,26,0.98),rgba(7,11,18,0.98),rgba(4,7,16,1))]
        p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)]
        md:p-8
      "
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.26),transparent_55%)]" />
        <div className="absolute right-0 top-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.024)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:84px_84px] opacity-[0.04]" />
      </div>

      <div className="relative space-y-6">
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
              Publication Monitor
            </div>

            <div className="max-w-3xl space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Understand exactly how each run is moving.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">
                The panel detects active runs from the global pending queue, loads the latest one automatically, and helps explain skipped, failed and successful jobs.
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Global Queue
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Pending SKUs</p>
                <p className="mt-2 text-2xl font-semibold text-white">{pendingJobs.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Active runs</p>
                <p className="mt-2 text-2xl font-semibold text-white">{pendingRunIds.length}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              This panel uses the global pending endpoint to detect if there are SKUs still waiting to be published, regardless of which run created them.
            </p>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-black/20 p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:flex-row">
            <div className="flex-1">
              <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Run ID (optional)
              </label>
              <input
                value={draftRunId}
                onChange={(event) => setDraftRunId(event.target.value)}
                placeholder="Optional: load a specific run, for example 56"
                className="
                  mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.04]
                  px-4 py-4 text-sm text-white outline-none transition
                  focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20
                "
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={!draftRunId.trim() || loading}
                className="
                  inline-flex min-w-[220px] items-center justify-center rounded-2xl
                  border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)]
                  px-6 py-4 text-sm font-semibold text-white
                  shadow-[0_18px_40px_rgba(37,99,235,0.35)]
                  transition duration-200 hover:scale-[1.01]
                  hover:shadow-[0_22px_50px_rgba(37,99,235,0.4)]
                  disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100
                "
              >
                {loading ? 'Refreshing...' : 'Load specific run'}
              </button>
            </div>
          </form>
        </section>

        {error && (
          <section className="rounded-[24px] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            {error}
          </section>
        )}

        <section className="rounded-[24px] border border-white/10 bg-black/20 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Active Runs From Pending Queue
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Runs inferred from the current pending SKU queue.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refresh(runId)}
              className="text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
            >
              Refresh now
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {activeRuns.length > 0 ? (
              activeRuns.map((activeRun) => (
                <ActiveRunCard
                  key={activeRun.id}
                  run={activeRun}
                  onSelect={(nextRunId) => {
                    setRunId(nextRunId);
                    setDraftRunId(nextRunId);
                    void refresh(nextRunId);
                  }}
                />
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-sm text-zinc-500 lg:col-span-3">
                No active runs were detected from the global pending queue.
              </div>
            )}
          </div>
        </section>

        {!runId && (
          <section className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center">
            <p className="text-base font-medium text-white">
              No active run detected
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              As soon as the pending queue returns SKUs for a run, the panel will pick it automatically. You can still load a specific run manually if needed.
            </p>
          </section>
        )}

        {run && runMetrics && (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              <MetricCard
                label="Run"
                value={`#${run.id}`}
                hint={derivedStatus}
              />
              <MetricCard
                label="Progress"
                value={`${runMetrics.completion}%`}
                hint={`${runMetrics.settled} of ${runMetrics.total} jobs settled`}
              />
              <MetricCard
                label="Success"
                value={runMetrics.success}
                hint="Published successfully"
                tone="success"
              />
              <MetricCard
                label="Skipped"
                value={runMetrics.skipped}
                hint="Skipped with a reason"
                tone="warning"
              />
              <MetricCard
                label="Failed"
                value={runMetrics.failed}
                hint="Ended with an error"
                tone="danger"
              />
              <MetricCard
                label="Pending"
                value={runMetrics.pending}
                hint={`Processing now: ${runMetrics.processing}`}
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      Overall Progress
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {runMetrics.completion}% complete
                    </p>
                  </div>

                  <div className={`rounded-full border px-3 py-1 text-xs ${getStatusTone(derivedStatus)}`}>
                    {derivedStatus}
                  </div>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8,#34d399)] transition-all duration-500"
                    style={{ width: `${runMetrics.completion}%` }}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-zinc-300 md:grid-cols-4">
                  <div className="rounded-2xl bg-white/[0.04] px-4 py-3">Pending: {runMetrics.pending}</div>
                  <div className="rounded-2xl bg-white/[0.04] px-4 py-3">Processing: {runMetrics.processing}</div>
                  <div className="rounded-2xl bg-white/[0.04] px-4 py-3">Cancelled: {runMetrics.cancelled}</div>
                  <div className="rounded-2xl bg-white/[0.04] px-4 py-3">Retry: {runMetrics.retry}</div>
                </div>

                {runMetrics.unknown > 0 && (
                  <p className="mt-4 text-xs text-zinc-500">
                    {runMetrics.unknown} jobs were resolved by the backend but are not classified yet in success, failed or skipped.
                  </p>
                )}
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  Run Details
                </p>
                <div className="mt-4 space-y-4">
                  <DetailRow label="Marketplaces" value={run.marketplaces.join(', ')} />
                  <DetailRow label="Created" value={formatDate(run.created_at)} />
                  <DetailRow label="Started" value={formatDate(run.started_at)} />
                  <DetailRow label="Finished" value={formatDate(run.finished_at)} />
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  Why jobs were skipped or failed
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Top reasons detected from the run jobs payloads.
                </p>

                <div className="mt-5 space-y-3">
                  {reasonSummary.length > 0 ? (
                    reasonSummary.map((item) => (
                      <div
                        key={item.reason}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                      >
                        <p className="text-sm text-white">{item.reason}</p>
                        <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-xs text-zinc-300">
                          {item.count}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-sm text-zinc-500">
                      No skipped or failed reasons were found in the loaded jobs.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      Run Jobs
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      Last 50 jobs with status and reason.
                    </p>
                  </div>
                  <div className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                    {runJobs.length} loaded
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                  <div className="max-h-[360px] overflow-y-auto">
                  <table className="min-w-full divide-y divide-white/10 text-sm">
                    <thead className="bg-white/[0.04] text-zinc-400">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">SKU</th>
                        <th className="px-4 py-3 text-left font-medium">Marketplace</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Reason</th>
                        <th className="px-4 py-3 text-left font-medium">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-black/10 text-zinc-200">
                      {runJobs.length > 0 ? (
                        runJobs.map((job) => (
                          <tr key={job.id} className="hover:bg-white/[0.03]">
                            <td className="px-4 py-3 font-mono text-xs">{job.sku}</td>
                            <td className="px-4 py-3 capitalize">{job.marketplace}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusTone(job.status)}`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-zinc-300">{getJobReason(job)}</td>
                            <td className="px-4 py-3 text-xs text-zinc-400">{formatDate(job.updated_at)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                            No jobs were returned for this run.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function ActiveRunCard({
  run,
  onSelect,
}: {
  run: PublicationRun;
  onSelect: (runId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(run.id)}
      className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-white">Run #{run.id}</p>
          <p className="mt-1 text-sm text-zinc-400">{run.marketplaces.join(', ')}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-xs text-zinc-300">
          {run.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-zinc-400">
        <div className="rounded-xl bg-black/10 px-3 py-2">
          Pending {toNumber(run.pending_jobs)}
        </div>
        <div className="rounded-xl bg-black/10 px-3 py-2">
          Processing {toNumber(run.processing_jobs)}
        </div>
        <div className="rounded-xl bg-black/10 px-3 py-2">
          Skipped {toNumber(run.skipped_jobs)}
        </div>
      </div>
    </button>
  );
}
