'use client';

import {
  ProductImportRun,
  ProductImportRunStatus,
} from '@/src/core/entitis/marketplace/shared/import/get/ProductImportRun';

type Props = {
  run: ProductImportRun;
};

export function ImportProductsProgress({ run }: Props) {
  const isRunning =
    run.status === 'STARTED' || run.status === 'RUNNING';

  const progress =
    run.status === 'SUCCESS'
      ? 100
      : run.status === 'FAILED'
      ? 100
      : Math.min(run.batches_processed * 5, 95);

  const statusStyles: Record<ProductImportRunStatus, string> = {
    STARTED: 'bg-cyan-400/15 text-cyan-100',
    RUNNING: 'bg-cyan-400/15 text-cyan-100',
    SUCCESS: 'bg-emerald-400/15 text-emerald-100',
    FAILED: 'bg-red-500/15 text-red-100',
  };

  const progressBarColors: Record<ProductImportRunStatus, string> = {
    STARTED: 'bg-cyan-400',
    RUNNING: 'bg-cyan-400',
    SUCCESS: 'bg-emerald-400',
    FAILED: 'bg-red-400',
  };

  const statusClass = statusStyles[run.status];
  const barColor = progressBarColors[run.status];

  return (
    <div className="space-y-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
          >
            {run.status}
          </span>

          {isRunning && (
            <span className="animate-pulse text-xs text-cyan-200">
              importing...
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-500">
          {new Date(run.started_at).toLocaleString()}
        </span>
      </div>
      <div className="space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
          <div
            className={`h-full ${barColor} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-zinc-400">
          Progress: {progress}%
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <Stat
          label="Processed"
          value={run.items_processed}
        />
        <Stat
          label="Failed"
          value={run.items_failed}
        />
        <Stat
          label="Batches"
          value={run.batches_processed}
        />
      </div>
      {run.error_message && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          {run.error_message}
        </div>
      )}
    </div>
  );
}

/* =========================
   STAT COMPONENT
========================= */

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-3">
      <div className="text-lg font-semibold text-white">
        {value}
      </div>
      <div className="text-xs text-zinc-500">
        {label}
      </div>
    </div>
  );
}
