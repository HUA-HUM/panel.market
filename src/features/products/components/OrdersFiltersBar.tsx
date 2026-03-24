'use client';

import { OrdersMarketplaceFilter, OrdersPreset } from '@/src/features/products/hooks/useOrdersDashboard';

type Props = {
  activePreset: OrdersPreset;
  marketplace: OrdersMarketplaceFilter;
  from: string;
  to: string;
  loading: boolean;
  onPresetSelect: (preset: Exclude<OrdersPreset, 'custom'>) => void;
  onMarketplaceChange: (value: OrdersMarketplaceFilter) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onApplyCustomRange: () => void;
};

const PRESETS: Array<{ label: string; value: Exclude<OrdersPreset, 'custom'> }> = [
  { label: 'Last 24h', value: 'last24' },
  { label: '24h', value: 24 },
  { label: '48h', value: 48 },
  { label: '72h', value: 72 },
  { label: 'Historical', value: 'historical' },
];

export function OrdersFiltersBar({
  activePreset,
  marketplace,
  from,
  to,
  loading,
  onPresetSelect,
  onMarketplaceChange,
  onFromChange,
  onToChange,
  onApplyCustomRange,
}: Props) {
  return (
    <div className="space-y-5 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Order overview
          </h2>
          <p className="text-xs text-zinc-500">
            Quick presets and custom range filters.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const active = activePreset === preset.value;

          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onPresetSelect(preset.value)}
              className={`rounded-2xl px-4 py-2 text-sm transition ${
                active
                  ? 'bg-[linear-gradient(135deg,rgba(103,232,249,0.16),rgba(37,99,235,0.18))] text-white'
                  : 'border border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/20 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1fr_1fr_auto]">
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Marketplace
          </label>
          <select
            value={marketplace}
            onChange={(event) => onMarketplaceChange(event.target.value as OrdersMarketplaceFilter)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
          >
            <option value="all">All marketplaces</option>
            <option value="fravega">Fravega</option>
            <option value="megatone">Megatone</option>
            <option value="oncity">Oncity</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            From
          </label>
          <input
            type="datetime-local"
            value={from}
            onChange={(event) => onFromChange(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            To
          </label>
          <input
            type="datetime-local"
            value={to}
            onChange={(event) => onToChange(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onApplyCustomRange}
            disabled={loading || !from || !to}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] px-5 py-3 text-sm font-medium text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Apply range'}
          </button>
        </div>
      </div>
    </div>
  );
}
