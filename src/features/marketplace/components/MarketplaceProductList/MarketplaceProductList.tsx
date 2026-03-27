'use client';

import { BrandSpinner } from '@/src/components/loader/BrandSpinner';
import { useMarketplaceProducts } from './hooks/ProductList/useMarketplaceProducts';
import { MarketplaceProductCard } from './MarketplaceProductCard';
import { MarketplaceProductSkeleton } from './MarketplaceProductSkeleton';

type Props = {
  marketplaceId: string;
};

export default function MarketplaceProductList({ marketplaceId }: Props) {
  const {
    items,
    page,
    count,
    total,
    summary,
    totalPages,
    loading,
    paging,
    fetchNext,
    fetchPrev,
    refresh,
  } = useMarketplaceProducts({ marketplaceId });

  const statusCards = summary?.statuses ?? [];

  return (
    <div className="relative space-y-6 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Published products
            </h3>
            <p className="text-xs text-zinc-500">
              Catalog snapshot from the latest marketplace sync.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <MetricCard
              label="Total"
              value={total.toLocaleString()}
            />
            <MetricCard
              label="Loaded"
              value={count.toLocaleString()}
            />
            <MetricCard
              label="Page"
              value={`${page}/${totalPages || 1}`}
            />
          </div>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          className="
            inline-flex items-center gap-2 rounded-xl border border-white/10
            bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300
            transition hover:border-white/20 hover:text-white disabled:opacity-40
          "
        >
          ⟳ Refresh
        </button>
      </div>

      {statusCards.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {statusCards.map(status => (
            <div
              key={status.status}
              className={`rounded-[20px] border px-4 py-4 ${getStatusCardTone(status.status)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                    {status.status}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {status.total.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-xs text-zinc-300">
                  {status.percentage.toFixed(2)}%
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-white/75"
                  style={{ width: `${Math.min(100, Math.max(0, status.percentage))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {loading && items.length === 0 &&
            Array.from({ length: 12 }).map((_, i) => (
              <MarketplaceProductSkeleton key={i} />
            ))}

          {!loading &&
            items.map(product => (
              <MarketplaceProductCard
                key={`${product.publicationId}-${product.sellerSku}`}
                product={product}
              />
            ))}
        </div>

        {!loading && items.length === 0 && (
          <div className="rounded-[20px] border border-dashed border-white/10 bg-black/10 px-6 py-12 text-center">
            <div className="text-sm font-medium text-white">
              No products found
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              This marketplace did not return items for the current page.
            </div>
          </div>
        )}

        {(loading || paging) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[20px] bg-[#07101dcc] backdrop-blur-sm">
            <BrandSpinner />
            <span className="text-xs text-zinc-400">
              Loading products...
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/8 pt-4">
        <span className="text-xs text-zinc-500">
          Page <b className="text-white">{page}</b> of{' '}
          <b className="text-white">{totalPages || 1}</b>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPrev}
            disabled={page === 1 || paging}
            className="
              rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5
              text-xs font-medium text-zinc-300 transition hover:border-white/20
              hover:text-white disabled:opacity-30
            "
          >
            ← Previous
          </button>
          <button
            onClick={fetchNext}
            disabled={page === totalPages || paging}
            className="
              rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5
              text-xs font-medium text-zinc-300 transition hover:border-white/20
              hover:text-white disabled:opacity-30
            "
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-white">
        {value}
      </div>
    </div>
  );
}

function getStatusCardTone(status: string) {
  const normalized = status.toUpperCase();

  if (normalized.includes('ACTIVE')) {
    return 'border-emerald-400/20 bg-emerald-400/10';
  }

  if (normalized.includes('PENDING') || normalized.includes('QUEUE')) {
    return 'border-sky-400/20 bg-sky-400/10';
  }

  if (
    normalized.includes('PAUSED') ||
    normalized.includes('INACTIVE')
  ) {
    return 'border-amber-400/20 bg-amber-400/10';
  }

  if (
    normalized.includes('REVIEW') ||
    normalized.includes('REVISION') ||
    normalized.includes('EDITING')
  ) {
    return 'border-violet-400/20 bg-violet-400/10';
  }

  if (normalized.includes('DELETE') || normalized.includes('REMOVED')) {
    return 'border-rose-400/20 bg-rose-400/10';
  }

  return 'border-white/10 bg-white/[0.04]';
}
