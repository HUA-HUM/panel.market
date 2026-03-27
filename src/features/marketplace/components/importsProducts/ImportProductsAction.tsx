'use client';

import { BrandSpinner } from '@/src/components/loader/BrandSpinner';
import { useRunImportProducts } from './hooks/useRunImportProducts';
import { useProductImportRuns } from './hooks/useProductImportRuns';
import { ImportProductsProgress } from './ImportProductsProgress';

type Props = {
  marketplace: 'megatone' | 'oncity' | 'fravega';
};

export function ImportProductsAction({ marketplace }: Props) {
  const {
    runImport,
    loading: runImportLoading,
    error,
  } = useRunImportProducts({ marketplace });

  const {
    runs,
    latestRun,
  } = useProductImportRuns({ marketplace });

  const isImportRunning =
    runImportLoading ||
    latestRun?.status === 'QUEUED' ||
    latestRun?.status === 'STARTED' ||
    latestRun?.status === 'RUNNING';

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">
              Import products
            </h3>
            <div className="relative group">
              <div className="flex h-5 w-5 cursor-default items-center justify-center rounded-full bg-white/[0.08] text-xs font-semibold text-zinc-300">
                ?
              </div>
              <div className="pointer-events-none absolute left-1/2 top-7 z-10 w-72 -translate-x-1/2 rounded-xl border border-white/10 bg-[#0b1020] p-3 text-xs text-zinc-300 shadow-2xl opacity-0 transition group-hover:opacity-100">
                Pulls products, stock, pricing, and available marketplace data into the platform.
              </div>
            </div>
          </div>
          <button
            onClick={runImport}
            disabled={isImportRunning}
            className={`
              rounded-xl px-4 py-2 text-sm font-medium transition
              ${
                isImportRunning
                  ? 'cursor-not-allowed bg-white/[0.08] text-zinc-500'
                  : 'border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] text-white'
              }
            `}
          >
            {isImportRunning ? 'Importing...' : 'Run import'}
          </button>
        </div>
      </div>

      {isImportRunning && !latestRun && (
        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <BrandSpinner size={18} />
          <span>Initializing import...</span>
        </div>
      )}

      {(latestRun?.status === 'QUEUED' ||
        latestRun?.status === 'STARTED' ||
        latestRun?.status === 'RUNNING') && (
        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <BrandSpinner size={18} />
          <span>
            {latestRun?.status === 'QUEUED'
              ? 'Import queued...'
              : 'Import in progress...'}
          </span>
        </div>
      )}

      {runs.length > 0 && (
        <div className="space-y-3">
          {runs.map(run => (
            <ImportProductsProgress
              key={run.id}
              run={run}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
