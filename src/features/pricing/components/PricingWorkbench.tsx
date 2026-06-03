'use client';

import { BrandSpinner } from '@/src/components/loader/BrandSpinner';
import { usePricingCalculator } from '@/src/features/pricing/hooks/usePricingCalculator';

const CHANNEL_OPTIONS = [
  { label: 'Megatone', value: 'megatone' },
  { label: 'Fravega', value: 'fravega' },
  { label: 'Oncity', value: 'oncity' },
] as const;

function formatMoney(value: number | undefined) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

export function PricingWorkbench() {
  const {
    rows,
    result,
    loading,
    error,
    canSubmit,
    summary,
    addRow,
    removeRow,
    updateRow,
    submit,
  } = usePricingCalculator();

  return (
    <div className="min-h-screen w-full px-6 py-10">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(8,47,73,0.28),rgba(15,23,42,0.9))] p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
                Pricing Workspace
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-white">
                  Pricing
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                  Build one or many SKU pricing scenarios and compare margin, suggested price, and pause recommendation by sales channel.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <MiniMetric label="Rows" value={String(rows.length)} />
              <MiniMetric label="Results" value={String(result?.items.length ?? 0)} />
              <MiniMetric label="Profitable" value={String(summary.profitable)} />
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-[22px] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Inputs
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Define SKU, sale price and sales channel for each row.
                </p>
              </div>

              <button
                type="button"
                onClick={addRow}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-white/20 hover:text-white"
              >
                Add row
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="grid gap-3 rounded-[20px] border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1.1fr_0.8fr_0.8fr_auto]"
                >
                  <label className="space-y-2">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      SKU {index + 1}
                    </span>
                    <input
                      value={row.sku}
                      onChange={(event) =>
                        updateRow(row.id, 'sku', event.target.value)
                      }
                      placeholder="B0F47N62NN"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      Sale price
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={row.salePrice}
                      onChange={(event) =>
                        updateRow(row.id, 'salePrice', event.target.value)
                      }
                      placeholder="731399"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      Channel
                    </span>
                    <select
                      value={row.salesChannel}
                      onChange={(event) =>
                        updateRow(
                          row.id,
                          'salesChannel',
                          event.target.value as (typeof CHANNEL_OPTIONS)[number]['value']
                        )
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#0b1422] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                    >
                      {CHANNEL_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/8 pt-4">
              <div className="text-xs text-zinc-500">
                Send one or many rows in a single pricing calculation request.
              </div>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={!canSubmit || loading}
                className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-2">
                  {loading ? <BrandSpinner size={14} /> : null}
                  {loading ? 'Calculating...' : 'Calculate pricing'}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              <MiniMetric label="Profitable" value={String(summary.profitable)} />
              <MiniMetric label="Should pause" value={String(summary.shouldPause)} />
              <MiniMetric label="Avg. margin" value={`${summary.averageMargin}%`} />
            </section>

            <section className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Results
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Profitability, suggestion and pause guidance for each SKU.
                  </p>
                </div>
                {loading ? (
                  <span className="inline-flex items-center gap-2 text-xs text-zinc-400">
                    <BrandSpinner size={14} />
                    Processing
                  </span>
                ) : null}
              </div>

              {result?.items.length ? (
                <div className="mt-5 space-y-3">
                  {result.items.map(item => (
                    <div
                      key={`${item.input.salesChannel}-${item.input.sku}`}
                      className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="font-mono text-sm text-white">
                            {item.input.sku}
                          </div>
                          <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-zinc-300">
                            {item.input.salesChannel}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <StatusBadge
                            label={item.status.profitable ? 'Profitable' : 'Not profitable'}
                            tone={item.status.profitable ? 'success' : 'danger'}
                          />
                          <StatusBadge
                            label={item.status.shouldPause ? 'Should pause' : 'Can stay active'}
                            tone={item.status.shouldPause ? 'warning' : 'neutral'}
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <ResultPill
                          label="Sale price"
                          value={formatMoney(item.prices.salePrice)}
                        />
                        <ResultPill
                          label="Total costs"
                          value={formatMoney(item.resultados.totalCosts)}
                        />
                        <ResultPill
                          label="Operating profit"
                          value={formatMoney(item.resultados.operatingProfit)}
                        />
                        <ResultPill
                          label="Profit %"
                          value={item.resultados.operatingProfitPercent}
                        />
                        <ResultPill
                          label="Suggested price"
                          value={formatMoney(item.precio.suggestedPrice)}
                        />
                        <ResultPill
                          label="Discount"
                          value={item.precio.discount}
                        />
                        <ResultPill
                          label="Commission %"
                          value={`${item.costosOperativos.commissionMpPercentage}%`}
                        />
                        <ResultPill
                          label="Category"
                          value={item.datosBase.categoryId || 'N/A'}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-[20px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-14 text-center text-sm text-zinc-500">
                  Add one or more rows and run the calculation to see pricing results here.
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
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

function ResultPill({
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

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral';
}) {
  const tones = {
    success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
    warning: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
    danger: 'border-rose-400/20 bg-rose-400/10 text-rose-100',
    neutral: 'border-white/10 bg-white/[0.05] text-zinc-200',
  } as const;

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {label}
    </span>
  );
}
