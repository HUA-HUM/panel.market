'use client';

import { MarketplaceProductsStatusSummary } from '@/src/features/marketplace/components/StatusProducts/MarketplaceProductsStatusSummary';

type Props = {
  marketplaceId: string;
};

export function MarketplaceProductsHeader({
  marketplaceId,
}: Props) {
  return (
    <div className="space-y-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div>
        <h3 className="text-sm font-semibold text-white">
          Publication status
        </h3>
        <p className="text-xs text-zinc-500">
          Live distribution of publication states and current share by status.
        </p>
      </div>
      <MarketplaceProductsStatusSummary
        marketplace={marketplaceId}
      />
    </div>
  );
}
