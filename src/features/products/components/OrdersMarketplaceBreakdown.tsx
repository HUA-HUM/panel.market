'use client';

import { OrdersOverviewResponse } from '@/src/core/adapters/repository/apiOrders/shared/order.types';

type Props = {
  data: OrdersOverviewResponse;
};

export function OrdersMarketplaceBreakdown({ data }: Props) {
  const max = Math.max(...data.marketplaces.map((item) => item.total), 1);

  return (
    <div className="space-y-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div>
        <h3 className="text-sm font-semibold text-white">
          Marketplace breakdown
        </h3>
        <p className="text-xs text-zinc-500">
          Orders grouped by marketplace.
        </p>
      </div>

      <div className="space-y-4">
        {data.marketplaces.map((marketplace) => {
          const width = `${(marketplace.total / max) * 100}%`;

          return (
            <div key={marketplace.marketplace} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize text-zinc-300">
                  {marketplace.marketplace}
                </span>
                <span className="text-white">
                  {marketplace.total.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8,#34d399)]"
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
