'use client';

import { FormEvent } from 'react';
import { BrandSpinner } from '@/src/components/loader/BrandSpinner';
import { useMarketplaceCatalog } from '@/src/features/catalog/hooks/useMarketplaceCatalog';

const MARKETPLACE_META: Record<string, { label: string; accent: string }> = {
  megatone: {
    label: 'Megatone',
    accent: 'border-sky-400/20 bg-sky-400/10 text-sky-100',
  },
  oncity: {
    label: 'Oncity',
    accent: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  },
  fravega: {
    label: 'Fravega',
    accent: 'border-orange-400/20 bg-orange-400/10 text-orange-100',
  },
};

function formatMoney(value: number | undefined) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getStatusTone(status: string | undefined) {
  const normalized = (status ?? '').toUpperCase();

  if (normalized.includes('ACTIVE')) {
    return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100';
  }

  if (normalized.includes('PENDING') || normalized.includes('QUEUE')) {
    return 'border-sky-400/20 bg-sky-400/10 text-sky-100';
  }

  if (
    normalized.includes('REVIEW') ||
    normalized.includes('REVISION') ||
    normalized.includes('EDITING')
  ) {
    return 'border-violet-400/20 bg-violet-400/10 text-violet-100';
  }

  if (
    normalized.includes('PAUSED') ||
    normalized.includes('INACTIVE')
  ) {
    return 'border-amber-400/20 bg-amber-400/10 text-amber-100';
  }

  if (normalized.includes('DELETE') || normalized.includes('REMOVED')) {
    return 'border-rose-400/20 bg-rose-400/10 text-rose-100';
  }

  return 'border-white/10 bg-white/[0.05] text-zinc-200';
}

export function MarketplaceCatalogPanel() {
  const {
    items,
    selectedSku,
    selectedProduct,
    page,
    total,
    totalPages,
    loading,
    detailLoading,
    error,
    setSelectedSku,
    fetchPage,
    fetchProduct,
    selectProductFromList,
  } = useMarketplaceCatalog();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetchProduct(selectedSku);
  };

  return (
    <div className="w-full px-6 py-10">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <section className="rounded-[26px] border border-white/10 bg-[linear-gradient(135deg,rgba(8,47,73,0.26),rgba(15,23,42,0.88))] p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
                Product Presence
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                Products
              </h1>
              <p className="text-sm text-zinc-400">
                Check where each SKU is published and compare its current marketplace state.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-[720px] flex-col gap-3 md:flex-row"
            >
              <input
                value={selectedSku}
                onChange={(event) => setSelectedSku(event.target.value)}
                placeholder="Search by seller SKU"
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
              />
              <button
                type="submit"
                disabled={!selectedSku.trim() || detailLoading}
                className="inline-flex min-w-[180px] items-center justify-center rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-2">
                  {detailLoading ? <BrandSpinner size={14} /> : null}
                  {detailLoading ? 'Loading...' : 'Find SKU'}
                </span>
              </button>
            </form>
          </div>
        </section>

        {error && (
          <section className="rounded-[22px] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            {error}
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <SimpleStat
            label="Total products"
            value={total}
          />
          <SimpleStat
            label="Page"
            value={`${page}/${totalPages}`}
          />
          <SimpleStat
            label="Selected SKU"
            value={selectedProduct?.sellerSku ?? '--'}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  SKU list
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Select any SKU to inspect its marketplace presence.
                </p>
              </div>
              {loading ? (
                <span className="inline-flex items-center gap-2 text-xs text-zinc-400">
                  <BrandSpinner size={14} />
                  Refreshing
                </span>
              ) : null}
            </div>

            <div className="mt-5 space-y-3">
              {loading && items.length === 0
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-[92px] animate-pulse rounded-[20px] border border-white/10 bg-white/[0.04]"
                    />
                  ))
                : null}

              {!loading && items.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-12 text-center text-sm text-zinc-500">
                  No products returned by the marketplaces endpoint.
                </div>
              ) : null}

              {items.map(product => (
                <button
                  key={product.sellerSku}
                  type="button"
                  onClick={() => selectProductFromList(product)}
                  className={`block w-full rounded-[20px] border px-4 py-4 text-left transition ${
                    selectedProduct?.sellerSku === product.sellerSku
                      ? 'border-cyan-300/25 bg-cyan-300/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate font-mono text-sm text-white">
                        {product.sellerSku}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {product.marketplaces.map(marketplace => (
                          <MarketplaceChip
                            key={`${product.sellerSku}-${marketplace}`}
                            marketplace={marketplace}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-zinc-500">
                        {product.marketplaces.length} marketplaces
                      </div>
                      <div className="mt-2 text-sm font-medium text-white">
                        {getPrimaryStatus(product.statusByMarketplace)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
              <span className="text-xs text-zinc-500">
                Page <span className="font-semibold text-white">{page}</span> of{' '}
                <span className="font-semibold text-white">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void fetchPage(page - 1)}
                  disabled={page <= 1 || loading}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => void fetchPage(page + 1)}
                  disabled={page >= totalPages || loading}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  SKU detail
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Price, stock and state by marketplace.
                </p>
              </div>
              {detailLoading ? (
                <span className="inline-flex items-center gap-2 text-xs text-zinc-400">
                  <BrandSpinner size={14} />
                  Loading
                </span>
              ) : null}
            </div>

            {selectedProduct ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    Seller SKU
                  </div>
                  <div className="mt-2 font-mono text-sm text-white">
                    {selectedProduct.sellerSku}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {selectedProduct.marketplaces.map(marketplace => (
                    <div
                      key={marketplace}
                      className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <MarketplaceChip marketplace={marketplace} />
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusTone(selectedProduct.statusByMarketplace[marketplace])}`}>
                          {selectedProduct.statusByMarketplace[marketplace]}
                        </span>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-zinc-300">
                        <div>
                          Price:{' '}
                          <span className="font-medium text-white">
                            {formatMoney(selectedProduct.priceByMarketplace[marketplace])}
                          </span>
                        </div>
                        <div>
                          Stock:{' '}
                          <span className="font-medium text-white">
                            {selectedProduct.stockByMarketplace[marketplace] ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {selectedProduct.items.map(item => (
                    <div
                      key={`${selectedProduct.sellerSku}-${item.marketplace}`}
                      className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <MarketplaceChip marketplace={item.marketplace} />
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusTone(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <DetailRow
                          label="Marketplace SKU"
                          value={item.marketplaceSku}
                        />
                        <DetailRow
                          label="External ID"
                          value={item.externalId}
                        />
                        <DetailRow
                          label="Price"
                          value={formatMoney(item.price)}
                        />
                        <DetailRow
                          label="Stock"
                          value={String(item.stock)}
                        />
                        <DetailRow
                          label="Active"
                          value={item.isActive ? 'Yes' : 'No'}
                        />
                        <DetailRow
                          label="Last seen"
                          value={formatDate(item.lastSeenAt)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[20px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-14 text-center text-sm text-zinc-500">
                Select a SKU from the list or search for one to inspect its details.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function SimpleStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-white">
        {value}
      </div>
    </div>
  );
}

function MarketplaceChip({ marketplace }: { marketplace: string }) {
  const meta = MARKETPLACE_META[marketplace] ?? {
    label: marketplace,
    accent: 'border-white/10 bg-white/[0.06] text-zinc-200',
  };

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${meta.accent}`}>
      {meta.label}
    </span>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-white">
        {value}
      </div>
    </div>
  );
}

function getPrimaryStatus(statusByMarketplace: Record<string, string>) {
  const [firstStatus] = Object.values(statusByMarketplace);
  return firstStatus ?? 'No status';
}
