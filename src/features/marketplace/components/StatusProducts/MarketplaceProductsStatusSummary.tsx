'use client';

import { useMarketplaceProductsStatus } from './hooks/useMarketplaceProductsStatus';

type Props = {
  marketplace: 'megatone' | 'oncity';
};

const STATUS_ORDER = ['ACTIVE', 'PAUSED', 'DELETED'] as const;

const STATUS_META = {
  ACTIVE: {
    label: 'Active',
    bg: 'bg-emerald-400/10',
    text: 'text-emerald-200',
    border: 'border-emerald-400/20',
  },
  PAUSED: {
    label: 'Paused',
    bg: 'bg-amber-400/10',
    text: 'text-amber-200',
    border: 'border-amber-400/20',
  },
  DELETED: {
    label: 'Deleted',
    bg: 'bg-rose-400/10',
    text: 'text-rose-200',
    border: 'border-rose-400/20',
  },
} as const;

export function MarketplaceProductsStatusSummary({
  marketplace,
}: Props) {
  const { items, loading } =
    useMarketplaceProductsStatus({ marketplace });

  /* =========================
   * Normalizar estados faltantes
   * ========================= */
  const normalized = STATUS_ORDER.map(status => {
    const found = items.find(i => i.status === status);
    return {
      status,
      total: found ? found.total : 0,
    };
  });

  /* =========================
   * Skeleton inmediato
   * ========================= */
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="
              h-[96px] rounded-2xl border border-white/10 bg-white/[0.05]
              animate-pulse
            "
          />
        ))}
      </div>
    );
  }

  /* =========================
   * Data real
   * ========================= */
  return (
    <div className="grid grid-cols-3 gap-4">
      {normalized.map(({ status, total }) => {
        const meta = STATUS_META[status];

        return (
          <div
            key={status}
            className={`
              flex flex-col justify-center
              rounded-2xl
              border
              px-6 py-4
              ${meta.bg}
              ${meta.border}
              transition
              hover:shadow-[0_18px_40px_rgba(0,0,0,0.2)]
            `}
          >
            <span
              className={`
                text-sm font-medium
                ${meta.text}
                opacity-80
              `}
            >
              {meta.label}
            </span>

            <span
              className={`
                mt-1
                text-3xl font-semibold
                ${meta.text}
              `}
            >
              {total.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
