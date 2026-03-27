'use client';

import { useMarketplaceProductsStatus } from './hooks/useMarketplaceProductsStatus';

type Props = {
  marketplace: string;
};

export function MarketplaceProductsStatusSummary({
  marketplace,
}: Props) {
  const { items, summary, loading } =
    useMarketplaceProductsStatus({ marketplace });

  const normalized = [...items].sort((a, b) => b.total - a.total);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-[112px] animate-pulse rounded-[24px] border border-white/10 bg-white/[0.05]" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-[136px] animate-pulse rounded-[22px] border border-white/10 bg-white/[0.05]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.72),rgba(8,47,73,0.35))] p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              Overview
            </p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {Number(summary?.total ?? 0).toLocaleString()}
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              marketplace items tracked in the latest sync
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
            <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Marketplace
            </div>
            <div className="mt-1 text-sm font-medium text-white">
              {summary?.marketplace ?? marketplace}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {normalized.map(({ status, total, percentage }) => {
        const meta = getStatusMeta(status);

        return (
          <div
            key={status}
            className={`
              relative overflow-hidden rounded-[22px] border px-5 py-4
              ${meta.bg}
              ${meta.border}
              transition
              hover:shadow-[0_18px_40px_rgba(0,0,0,0.2)]
            `}
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${meta.accent}`} />
            <div className="relative">
            <span
              className={`
                text-sm font-medium opacity-80 ${meta.text}
              `}
            >
              {formatStatusLabel(status)}
            </span>

            <span
              className={`
                mt-2 block text-3xl font-semibold ${meta.text}
              `}
            >
              {total.toLocaleString()}
            </span>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                <span>Share</span>
                <span>{Number(percentage ?? 0).toFixed(2)}%</span>
              </div>
              <div className="h-2 rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-white/70"
                  style={{ width: `${Math.min(100, Math.max(0, Number(percentage ?? 0)))}%` }}
                />
              </div>
            </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

function getStatusMeta(status: string) {
  const normalized = status.toUpperCase();

  if (normalized.includes('ACTIVE')) {
    return {
      bg: 'bg-emerald-400/10',
      text: 'text-emerald-200',
      border: 'border-emerald-400/20',
      accent: 'from-emerald-300/20 to-emerald-500/5',
    };
  }

  if (normalized.includes('PENDING') || normalized.includes('QUEUE')) {
    return {
      bg: 'bg-sky-400/10',
      text: 'text-sky-200',
      border: 'border-sky-400/20',
      accent: 'from-sky-300/20 to-sky-500/5',
    };
  }

  if (
    normalized.includes('PAUSED') ||
    normalized.includes('INACTIVE')
  ) {
    return {
      bg: 'bg-amber-400/10',
      text: 'text-amber-200',
      border: 'border-amber-400/20',
      accent: 'from-amber-300/20 to-amber-500/5',
    };
  }

  if (
    normalized.includes('REVIEW') ||
    normalized.includes('REVISION') ||
    normalized.includes('EDITING')
  ) {
    return {
      bg: 'bg-violet-400/10',
      text: 'text-violet-200',
      border: 'border-violet-400/20',
      accent: 'from-violet-300/20 to-violet-500/5',
    };
  }

  if (normalized.includes('DELETE') || normalized.includes('REMOVED')) {
    return {
      bg: 'bg-rose-400/10',
      text: 'text-rose-200',
      border: 'border-rose-400/20',
      accent: 'from-rose-300/20 to-rose-500/5',
    };
  }

  return {
    bg: 'bg-white/[0.06]',
    text: 'text-zinc-100',
    border: 'border-white/10',
    accent: 'from-white/10 to-white/0',
  };
}

function formatStatusLabel(status: string) {
  return status
    .toLowerCase()
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
