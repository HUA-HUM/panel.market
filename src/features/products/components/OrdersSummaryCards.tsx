'use client';

import { OrdersOverviewResponse } from '@/src/core/adapters/repository/apiOrders/shared/order.types';

type Props = {
  data: OrdersOverviewResponse;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatAmount(value: number) {
  return `$${value.toLocaleString('es-AR')}`;
}

export function OrdersSummaryCards({ data }: Props) {
  const topMarketplace = [...data.marketplaces].sort((a, b) => b.total - a.total)[0];
  const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Orders"
        value={data.total.toLocaleString('es-AR')}
        hint={`${data.items.length} visible items`}
      />
      <SummaryCard
        label="Top marketplace"
        value={topMarketplace?.marketplace ?? 'N/A'}
        hint={`${topMarketplace?.total ?? 0} orders`}
      />
      <SummaryCard
        label="Amount"
        value={formatAmount(totalAmount)}
        hint="Based on loaded items"
      />
      <SummaryCard
        label="Range"
        value={formatDate(data.range.from)}
        hint={`to ${formatDate(data.range.to)}`}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        {hint}
      </p>
    </div>
  );
}
