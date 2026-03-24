'use client';

import { useMemo, useState } from 'react';
import { OrdersFiltersBar } from '@/src/features/products/components/OrdersFiltersBar';
import { OrdersMarketplaceBreakdown } from '@/src/features/products/components/OrdersMarketplaceBreakdown';
import { OrdersSummaryCards } from '@/src/features/products/components/OrdersSummaryCards';
import { OrdersTable } from '@/src/features/products/components/OrdersTable';
import {
  OrdersMarketplaceFilter,
  OrdersPreset,
  useOrdersDashboard
} from '@/src/features/products/hooks/useOrdersDashboard';

function toDateTimeLocal(value: Date) {
  const pad = (input: number) => String(input).padStart(2, '0');

  const year = value.getFullYear();
  const month = pad(value.getMonth() + 1);
  const day = pad(value.getDate());
  const hours = pad(value.getHours());
  const minutes = pad(value.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toIsoDate(value: string) {
  return new Date(value).toISOString();
}

export function OrdersOverviewPanel() {
  const {
    data,
    loading,
    error,
    activePreset,
    fetchLast24Hours,
    fetchRecent,
    fetchHistorical,
    fetchByRange,
  } = useOrdersDashboard();

  const now = useMemo(() => new Date(), []);
  const initialFrom = useMemo(() => {
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return toDateTimeLocal(start);
  }, [now]);
  const initialTo = useMemo(() => toDateTimeLocal(now), [now]);

  const [marketplace, setMarketplace] = useState<OrdersMarketplaceFilter>('all');
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);

  const handlePresetSelect = async (preset: Exclude<OrdersPreset, 'custom'>) => {
    if (preset === 'last24') {
      await fetchLast24Hours();
      return;
    }

    if (preset === 'historical') {
      await fetchHistorical();
      return;
    }

    await fetchRecent(preset);
  };

  const handleApplyCustomRange = async () => {
    await fetchByRange(
      {
        from: toIsoDate(from),
        to: toIsoDate(to),
      },
      marketplace
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
          Orders Workspace
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Orders
        </h1>
      </div>

      <OrdersFiltersBar
        activePreset={activePreset}
        marketplace={marketplace}
        from={from}
        to={to}
        loading={loading}
        onPresetSelect={handlePresetSelect}
        onMarketplaceChange={setMarketplace}
        onFromChange={setFrom}
        onToChange={setTo}
        onApplyCustomRange={handleApplyCustomRange}
      />

      {error && (
        <div className="rounded-[24px] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-6 py-10 text-center text-zinc-400">
          Loading orders...
        </div>
      )}

      {data && (
        <>
          <OrdersSummaryCards data={data} />

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <OrdersMarketplaceBreakdown data={data} />

            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <h3 className="text-sm font-semibold text-white">
                Response health
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <HealthCard label="Errors" value={String(data.errors.length)} />
                <HealthCard label="Loaded items" value={String(data.items.length)} />
              </div>
            </div>
          </div>

          <OrdersTable items={data.items} />
        </>
      )}
    </div>
  );
}

function HealthCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}
