'use client';

import { OrderItem } from '@/src/core/adapters/repository/apiOrders/shared/order.types';

type Props = {
  items: OrderItem[];
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

export function OrdersTable({ items }: Props) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Orders
          </h3>
          <p className="text-xs text-zinc-500">
            Combined results for the current filter.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
          {items.length} items
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/[0.04] text-zinc-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Marketplace</th>
              <th className="px-4 py-3 text-left font-medium">Order</th>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-black/10 text-zinc-200">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={`${item.marketplace}-${item.orderId}`} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3 capitalize">{item.marketplace}</td>
                  <td className="px-4 py-3 font-medium text-white">{item.orderId}</td>
                  <td className="px-4 py-3">{item.customerName}</td>
                  <td className="px-4 py-3">{item.latestStatus}</td>
                  <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3">{formatAmount(item.amount)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                  No orders found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
