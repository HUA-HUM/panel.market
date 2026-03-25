'use client';

import { PublicationRun } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunRepository';
import { usePublicationRuns } from '@/src/features/publisher/hook/usePublicationRuns';

type PublicationRunsPanelProps = {
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

function toNumber(value: string | number | null | undefined) {
  return Number(value ?? 0);
}

function getRunMetrics(run: PublicationRun) {
  const total = toNumber(run.total_jobs);
  const success = toNumber(run.actual_success_jobs ?? run.success_jobs);
  const failed = toNumber(run.actual_failed_jobs ?? run.failed_jobs);
  const skipped = toNumber(run.skipped_jobs);
  const cancelled = toNumber(run.cancelled_jobs);
  const pending = toNumber(run.pending_jobs);
  const processing = toNumber(run.processing_jobs);
  const settled = Math.max(success + failed + skipped + cancelled, total - pending - processing);
  const completion = total > 0 ? Math.round((settled / total) * 100) : 0;

  return {
    total,
    success,
    failed,
    skipped,
    cancelled,
    pending,
    processing,
    settled,
    completion,
  };
}

function getRunLabel(run: PublicationRun) {
  const metrics = getRunMetrics(run);

  if (metrics.processing > 0) return 'processing';
  if (metrics.pending > 0) return 'pending';
  if (metrics.failed > 0 && metrics.settled >= metrics.total) return 'completed with failures';
  if (metrics.skipped > 0 && metrics.settled >= metrics.total) return 'completed with skips';
  if (metrics.settled >= metrics.total) return 'completed';
  return run.status;
}

function getStatusTone(status: string) {
  switch (status) {
    case 'completed':
    case 'completed with skips':
      return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100';
    case 'completed with failures':
      return 'border-rose-400/20 bg-rose-400/10 text-rose-100';
    case 'processing':
      return 'border-sky-400/20 bg-sky-400/10 text-sky-100';
    case 'pending':
      return 'border-amber-400/20 bg-amber-400/10 text-amber-100';
    default:
      return 'border-white/10 bg-white/[0.04] text-zinc-200';
  }
}

export function PublicationRunsPanel({
  activeRunId,
  onSelectRun,
}: PublicationRunsPanelProps) {
  const { runs, loading, error, refresh } = usePublicationRuns();

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
            Runs
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            All publication runs
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Quick access to every run created, with a clearer real status.
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

      <section className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {runs.map((run) => {
          const metrics = getRunMetrics(run);
          const statusLabel = getRunLabel(run);
          const selected = activeRunId === run.id;

          return (
            <button
              key={run.id}
              type="button"
              onClick={() => onSelectRun?.(run.id)}
              className={`rounded-[24px] border p-5 text-left transition ${
                selected
                  ? 'border-cyan-300/25 bg-[linear-gradient(135deg,rgba(103,232,249,0.14),rgba(37,99,235,0.18))]'
                  : 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">Run #{run.id}</p>
                  <p className="mt-1 text-sm text-zinc-400">{run.marketplaces.join(', ')}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-xs ${getStatusTone(statusLabel)}`}>
                  {statusLabel}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <MiniMetric label="Jobs" value={metrics.total} />
                <MiniMetric label="Progress" value={`${metrics.completion}%`} />
                <MiniMetric label="Success" value={metrics.success} />
                <MiniMetric label="Skipped" value={metrics.skipped} />
                <MiniMetric label="Failed" value={metrics.failed} />
                <MiniMetric label="Pending" value={metrics.pending + metrics.processing} />
              </div>

              <div className="mt-5 space-y-3 text-xs text-zinc-400">
                <InfoRow label="Created" value={formatDate(run.created_at)} />
                <InfoRow label="Started" value={formatDate(run.started_at)} />
                <InfoRow label="Finished" value={formatDate(run.finished_at)} />
              </div>
            </button>
          );
        })}

        {!loading && runs.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-sm text-zinc-500 lg:col-span-2 2xl:col-span-3">
            No publication runs were returned by the API.
          </div>
        )}
      </section>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-2 last:border-b-0 last:pb-0">
      <span className="uppercase tracking-[0.18em] text-zinc-500">{label}</span>
      <span className="text-right text-zinc-300">{value}</span>
    </div>
  );
}
