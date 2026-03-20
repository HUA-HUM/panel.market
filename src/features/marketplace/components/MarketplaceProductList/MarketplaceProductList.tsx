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
    totalPages,
    loading,
    paging,
    fetchNext,
    fetchPrev,
    refresh,
  } = useMarketplaceProducts({ marketplaceId });

  return (
    <div className="relative space-y-6 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Published products
          </h3>
          <p className="text-xs text-zinc-500">
            {items.length} products loaded
          </p>
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
      <div className="relative">
        <div
          className="
            grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
          "
        >
          {(loading && items.length === 0) &&
            Array.from({ length: 12 }).map((_, i) => (
              <MarketplaceProductSkeleton key={i} />
            ))}

          {!loading &&
            items.map(product => (
              <MarketplaceProductCard
                key={product.publicationId}
                product={product}
              />
            ))}
        </div>
        {(loading || paging) && (
          <div
            className="
              absolute inset-0 z-10 flex flex-col items-center justify-center gap-3
              rounded-[20px] bg-[#07101dcc] backdrop-blur-sm
            "
          >
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
