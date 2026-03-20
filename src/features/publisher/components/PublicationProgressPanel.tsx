'use client';

import { FormEvent, useState } from 'react';
import { usePublicationProgress } from '../hook/usePublicationProgress';

type PublicationProgressPanelProps = {
  initialRunId?: string | null;
};

function formatDate(value: string | null) {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function toNumber(value?: string) {
  return Number(value ?? '0');
}

function MetricCard({
  label,
  value,
  hint,
  tone = 'default'
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
  initialRunId
}: PublicationProgressPanelProps) {
  const {
    runId,
    setRunId,
    run,
    progress,
    pendingJobs,
    loading,
    error,
    refresh
  } = usePublicationProgress({ initialRunId });
  const [draftRunId, setDraftRunId] = useState(initialRunId ?? '');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextRunId = draftRunId.trim();
    setRunId(nextRunId);
    await refresh(nextRunId);
  };

  const total = toNumber(progress?.total);
  const success = toNumber(progress?.success);
  const pending = toNumber(progress?.pending);
  const processing = toNumber(progress?.processing);
  const failed = toNumber(progress?.failed);
  const completed = success + failed;
  const completion = total > 0 ? Math.round((completed / total) * 100) : 0;

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
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
              Run Progress
            </div>

            <div className="max-w-3xl space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Track publication runs from a cleaner live dashboard.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">
                Enter a run ID to inspect its status, monitor completion, and review the jobs that are still pending.
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Live Snapshot
            </p>
            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Active Run
                </span>
                <span className="text-right text-sm font-medium text-white">
                  {runId || 'No run selected'}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Status
                </span>
                <span className="text-right text-sm font-medium text-white">
                  {loading ? 'Refreshing data' : run?.status ?? 'Idle'}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Auto Refresh
                </span>
                <span className="text-right text-sm font-medium text-white">
                  Every 5 seconds
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-black/20 p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:flex-row">
            <div className="flex-1">
              <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Run ID
              </label>
              <input
                value={draftRunId}
                onChange={(event) => setDraftRunId(event.target.value)}
                placeholder="Enter a run ID, for example 49"
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
                {loading ? 'Refreshing...' : 'Load Run Progress'}
              </button>
            </div>
          </form>
        </section>

        {!runId && (
          <section className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center">
            <p className="text-base font-medium text-white">
              No run selected yet
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Launch a publication run or enter an existing run ID to start monitoring progress.
            </p>
          </section>
        )}

        {error && (
          <section className="rounded-[24px] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            {error}
          </section>
        )}

        {run && progress && (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <MetricCard
                label="Run"
                value={`#${run.id}`}
                hint={run.status}
              />
              <MetricCard
                label="Completion"
                value={`${completion}%`}
                hint={`${completed} of ${total} jobs completed`}
              />
              <MetricCard
                label="Success"
                value={success}
                hint="Jobs completed successfully"
                tone="success"
              />
              <MetricCard
                label="Pending"
                value={pending}
                hint={`Processing now: ${processing}`}
                tone="warning"
              />
              <MetricCard
                label="Failed"
                value={failed}
                hint="Jobs that ended with error"
                tone="danger"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      Overall Progress
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {completion}% complete
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => void refresh()}
                    className="text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                  >
                    Refresh now
                  </button>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8,#34d399)] transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-zinc-300 md:grid-cols-4">
                  <div className="rounded-2xl bg-white/[0.04] px-4 py-3">Pending: {pending}</div>
                  <div className="rounded-2xl bg-white/[0.04] px-4 py-3">Processing: {processing}</div>
                  <div className="rounded-2xl bg-white/[0.04] px-4 py-3">Success: {success}</div>
                  <div className="rounded-2xl bg-white/[0.04] px-4 py-3">Failed: {failed}</div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  Run Details
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                    <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Marketplaces</span>
                    <span className="text-right text-sm font-medium text-white">
                      {run.marketplaces.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                    <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Created</span>
                    <span className="text-right text-sm font-medium text-white">
                      {formatDate(run.created_at)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                    <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Started</span>
                    <span className="text-right text-sm font-medium text-white">
                      {formatDate(run.started_at)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Finished</span>
                    <span className="text-right text-sm font-medium text-white">
                      {formatDate(run.finished_at)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                    Pending Jobs
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Showing the pending jobs returned for this run. Data refreshes automatically every 5 seconds.
                  </p>
                </div>
                <div className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                  {pendingJobs.length} visible
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead className="bg-white/[0.04] text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Job</th>
                      <th className="px-4 py-3 text-left font-medium">SKU</th>
                      <th className="px-4 py-3 text-left font-medium">Marketplace</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Attempts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-black/10 text-zinc-200">
                    {pendingJobs.length > 0 ? (
                      pendingJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-white/[0.03]">
                          <td className="px-4 py-3">#{job.id}</td>
                          <td className="px-4 py-3 font-mono text-xs">{job.sku}</td>
                          <td className="px-4 py-3 capitalize">{job.marketplace}</td>
                          <td className="px-4 py-3 capitalize">{job.status}</td>
                          <td className="px-4 py-3">{job.attempts}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                          No pending jobs for this run were found in the latest result set.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
