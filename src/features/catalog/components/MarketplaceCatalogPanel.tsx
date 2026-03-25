'use client';

import { FormEvent } from 'react';
import { useMarketplaceCatalog } from '@/src/features/catalog/hooks/useMarketplaceCatalog';

const MARKETPLACE_META: Record<string, { label: string; accent: string }> = {
  megatone: { label: 'Megatone', accent: 'bg-sky-400/15 text-sky-100 border-sky-400/20' },
  oncity: { label: 'Oncity', accent: 'bg-emerald-400/15 text-emerald-100 border-emerald-400/20' },
  fravega: { label: 'Fravega', accent: 'bg-orange-400/15 text-orange-100 border-orange-400/20' },
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
  switch ((status ?? '').toUpperCase()) {
    case 'ACTIVE':
      return 'bg-emerald-400/15 text-emerald-100 border-emerald-400/20';
    case 'PAUSED':
      return 'bg-amber-400/15 text-amber-100 border-amber-400/20';
    case 'DELETED':
      return 'bg-rose-400/15 text-rose-100 border-rose-400/20';
    default:
      return 'bg-white/[0.06] text-zinc-200 border-white/10';
  }
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
    marketplaceTotals,
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
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
              Product Presence
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Products across marketplaces
            </h1>
            <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
              See where each SKU is published and compare status, stock and price at a glance.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5"
          >
            <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Search by seller SKU
            </label>
            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <input
                value={selectedSku}
                onChange={(event) => setSelectedSku(event.target.value)}
                placeholder="Example: B0CW2XFT87"
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
              />
              <button
                type="submit"
                disabled={!selectedSku.trim() || detailLoading}
                className="inline-flex min-w-[200px] items-center justify-center rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.35)] disabled:opacity-50"
              >
                {detailLoading ? 'Loading...' : 'Load SKU'}
              </button>
            </div>
          </form>
        </section>

        {error && (
          <section className="rounded-[24px] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            {error}
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Loaded products" value={items.length} hint={`Page ${page} of ${totalPages}`} />
          <StatCard label="Total products" value={total} hint="Paginated list" />
          <StatCard label="Megatone" value={marketplaceTotals.megatone ?? 0} hint="Visible on this page" />
          <StatCard label="Oncity / Fravega" value={(marketplaceTotals.oncity ?? 0) + (marketplaceTotals.fravega ?? 0)} hint="Visible on this page" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  Product list
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Click any SKU to inspect marketplace details.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                {loading ? 'Refreshing' : `${items.length} loaded`}
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <div className="max-h-[620px] overflow-y-auto">
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead className="sticky top-0 bg-[#0d1527] text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Seller SKU</th>
                      <th className="px-4 py-3 text-left font-medium">Marketplaces</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Price view</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-black/10 text-zinc-200">
                    {items.map((product) => (
                      <tr
                        key={product.sellerSku}
                        className={`cursor-pointer hover:bg-white/[0.03] ${selectedProduct?.sellerSku === product.sellerSku ? 'bg-white/[0.03]' : ''}`}
                        onClick={() => selectProductFromList(product)}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-white">{product.sellerSku}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {product.marketplaces.map((marketplace) => (
                              <MarketplaceChip key={marketplace} marketplace={marketplace} />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(product.statusByMarketplace).map(([marketplace, status]) => (
                              <span
                                key={`${product.sellerSku}-${marketplace}`}
                                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusTone(status)}`}
                              >
                                {MARKETPLACE_META[marketplace]?.label ?? marketplace}: {status}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-300">
                          {Object.entries(product.priceByMarketplace)
                            .map(([marketplace, price]) => `${MARKETPLACE_META[marketplace]?.label ?? marketplace} ${formatMoney(price)}`)
                            .join(' · ')}
                        </td>
                      </tr>
                    ))}

                    {!loading && items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-zinc-500">
                          No products were returned by the marketplaces endpoint.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                Page <span className="font-semibold text-white">{page}</span> of <span className="font-semibold text-white">{totalPages}</span>
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
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  SKU detail
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Marketplace by marketplace publication details.
                </p>
              </div>
              {selectedProduct && (
                <span className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                  {selectedProduct.marketplaces.length} marketplaces
                </span>
              )}
            </div>

            {selectedProduct ? (
              <div className="mt-5 space-y-5">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Seller SKU</p>
                  <p className="mt-2 font-mono text-sm text-white">{selectedProduct.sellerSku}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {selectedProduct.marketplaces.map((marketplace) => (
                    <div key={marketplace} className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <MarketplaceChip marketplace={marketplace} />
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusTone(selectedProduct.statusByMarketplace[marketplace])}`}>
                          {selectedProduct.statusByMarketplace[marketplace]}
                        </span>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-zinc-300">
                        <div>Price: <span className="font-medium text-white">{formatMoney(selectedProduct.priceByMarketplace[marketplace])}</span></div>
                        <div>Stock: <span className="font-medium text-white">{selectedProduct.stockByMarketplace[marketplace] ?? 0}</span></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {selectedProduct.items.map((item) => (
                    <div key={`${selectedProduct.sellerSku}-${item.marketplace}`} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <MarketplaceChip marketplace={item.marketplace} />
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusTone(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <DetailPill label="Marketplace SKU" value={item.marketplaceSku} />
                        <DetailPill label="External ID" value={item.externalId} />
                        <DetailPill label="Price" value={formatMoney(item.price)} />
                        <DetailPill label="Stock" value={String(item.stock)} />
                        <DetailPill label="Active" value={item.isActive ? 'Yes' : 'No'} />
                        <DetailPill label="Last seen" value={formatDate(item.lastSeenAt)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-10 text-sm text-zinc-500">
                Select a SKU from the list or search by seller SKU to inspect where it is published.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-400">{hint}</p>
    </div>
  );
}

function MarketplaceChip({ marketplace }: { marketplace: string }) {
  const meta = MARKETPLACE_META[marketplace] ?? {
    label: marketplace,
    accent: 'bg-white/[0.06] text-zinc-200 border-white/10',
  };

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${meta.accent}`}>
      {meta.label}
    </span>
  );
}

function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
