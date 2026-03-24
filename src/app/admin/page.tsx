'use client';

import Image from 'next/image';
import { useOrdersDashboard } from '@/src/features/products/hooks/useOrdersDashboard';
import { OrderMarketplace } from '@/src/core/adapters/repository/apiOrders/shared/order.types';

const MARKETPLACE_META = {
  fravega: {
    label: 'Fravega',
    logo: '/marketplace/fravega.png',
  },
  megatone: {
    label: 'Megatone',
    logo: '/marketplace/Megatone.svg',
  },
  oncity: {
    label: 'Oncity',
    logo: '/marketplace/oncity.png',
  },
} as const;

const UPCOMING_MODULES = [
  {
    title: 'Shipping',
    value: '128',
    label: 'deliveries queued',
    tone: 'cyan',
  },
  {
    title: 'Billing',
    value: '34',
    label: 'invoices sent',
    tone: 'emerald',
  },
  {
    title: 'Updates',
    value: '7',
    label: 'commerce alerts',
    tone: 'amber',
  },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function AdminOverviewPage() {
  const { data, loading, error } = useOrdersDashboard();

  return (
    <div className="min-h-screen w-full px-6 py-8 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-[1480px] space-y-6">
        <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex w-fit items-center rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-100">
              Admin Overview
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Today at a glance
            </h1>
            <p className="text-sm text-zinc-400">
              Orders, shipments, billing and key updates in one place.
            </p>
          </div>

          {data && (
            <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
              Last 24h · {formatDate(data.range.to)}
            </span>
          )}
        </section>

        {error && (
          <section className="rounded-[22px] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            {error}
          </section>
        )}

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(8,12,26,0.96),rgba(10,15,28,0.98),rgba(5,8,18,1))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-100/70">
                  Orders
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Last 24 hours
                </h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-right">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Total
                </p>
                <p className="mt-1 text-3xl font-semibold text-white">
                  {data?.total ?? 0}
                </p>
              </div>
            </div>

            {loading && !data ? (
              <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-zinc-400">
                Loading order overview...
              </div>
            ) : (
              <>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {(data?.marketplaces ?? []).map((marketplace) => (
                    <MarketplaceMiniCard
                      key={marketplace.marketplace}
                      marketplace={marketplace.marketplace}
                      total={marketplace.total}
                    />
                  ))}
                </div>

                <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-white">
                        Latest activity
                      </p>
                      <p className="text-xs text-zinc-500">
                        Small snapshot from the latest response
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
                      {(data?.items ?? []).length} rows
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {(data?.items ?? []).slice(0, 3).map((item) => (
                      <div
                        key={`${item.marketplace}-${item.orderId}`}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-[#08111f] px-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <MarketplaceBadge marketplace={item.marketplace} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              Order {item.orderId}
                            </p>
                            <p className="truncate text-xs text-zinc-500">
                              {item.customerName}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-zinc-400">{item.latestStatus}</p>
                          <p className="text-xs text-zinc-500">{formatDate(item.createdAt)}</p>
                        </div>
                      </div>
                    ))}

                    {(data?.items ?? []).length === 0 && (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-zinc-500">
                        No orders registered in the last 24 hours.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="grid gap-5">
            {UPCOMING_MODULES.map((module) => (
              <UpcomingModuleCard
                key={module.title}
                title={module.title}
                value={module.value}
                label={module.label}
                tone={module.tone}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MarketplaceMiniCard({
  marketplace,
  total,
}: {
  marketplace: OrderMarketplace;
  total: number;
}) {
  const meta = MARKETPLACE_META[marketplace];

  return (
    <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-2.5">
          <div className="relative h-6 w-16">
            <Image src={meta.logo} alt={meta.label} fill className="object-contain" />
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{meta.label}</p>
          <p className="text-xs text-zinc-500">Orders</p>
        </div>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{total}</p>
    </div>
  );
}

function MarketplaceBadge({ marketplace }: { marketplace: OrderMarketplace }) {
  const meta = MARKETPLACE_META[marketplace];

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-2">
      <div className="relative h-5 w-12">
        <Image src={meta.logo} alt={meta.label} fill className="object-contain" />
      </div>
    </div>
  );
}

function UpcomingModuleCard({
  title,
  value,
  label,
  tone,
}: {
  title: string;
  value: string;
  label: string;
  tone: 'cyan' | 'emerald' | 'amber';
}) {
  const toneClasses = {
    cyan: 'border-cyan-300/15 bg-cyan-300/10 text-cyan-100',
    emerald: 'border-emerald-300/15 bg-emerald-300/10 text-emerald-100',
    amber: 'border-amber-300/15 bg-amber-300/10 text-amber-100',
  } as const;

  return (
    <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-zinc-500">Overview module</p>
        </div>

        <span className={`rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] ${toneClasses[tone]}`}>
          Soon
        </span>
      </div>

      <p className="mt-6 text-4xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm text-zinc-400">{label}</p>
    </div>
  );
}
