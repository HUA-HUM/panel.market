'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Marketplace } from '@/src/features/marketplace/config/marketplaces';
import MarketplaceProductList from '@/src/features/marketplace/components/MarketplaceProductList/MarketplaceProductList';
import { ImportProductsAction } from '@/src/features/marketplace/components/importsProducts/ImportProductsAction';
import { MarketplaceProductsHeader } from '@/src/features/marketplace/components/StatusProducts/MarketplaceProductsHeader';

type Props = {
  marketplace: Marketplace;
};

type Tab = 'products' | 'import' | 'actions';

const TABS: { id: Tab; label: string; description: string }[] = [
  { id: 'products', label: 'Products', description: 'Browse live marketplace items.' },
  { id: 'import', label: 'Imports', description: 'Sync marketplace catalog data.' },
  { id: 'actions', label: 'Status', description: 'Review publication state summary.' },
];

export default function MarketplaceDetailClient({ marketplace }: Props) {
  const [tab, setTab] = useState<Tab>('products');
  const router = useRouter();
  const operationsMarketplaceId = getOperationsMarketplaceId(marketplace.id);
  const supportsOperationsTabs = operationsMarketplaceId !== null;

  const activeIndex = TABS.findIndex(t => t.id === tab);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-5">
          <button
            onClick={() => router.push('/admin/marketplace')}
            className="group inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06]">
              ←
            </span>
            Back to marketplaces
          </button>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
              Marketplace Workspace
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-18 w-18 items-center justify-center rounded-[22px] border border-white/10 bg-white p-4 shadow-[0_18px_45px_rgba(255,255,255,0.08)]">
                <div className="relative h-10 w-24">
                  <Image
                    src={marketplace.logo}
                    alt={marketplace.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-4xl font-semibold tracking-tight text-white">
                  {marketplace.name}
                </h1>
                <p className="text-sm text-zinc-400">
                  {marketplace.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Active View
          </p>
          <div className="mt-4 space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Marketplace
              </span>
              <span className="text-right text-sm font-medium text-white">
                {marketplace.name}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Section
              </span>
              <span className="text-right text-sm font-medium text-white">
                {TABS[activeIndex]?.label}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Focus
              </span>
              <span className="max-w-[250px] text-right text-sm text-zinc-300">
                {TABS[activeIndex]?.description}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-2">
        <div className="relative flex rounded-[20px] bg-black/10 p-1">
          <span
            className="absolute bottom-1 top-1 rounded-[16px] bg-[linear-gradient(135deg,rgba(103,232,249,0.16),rgba(37,99,235,0.18))] transition-all duration-300"
            style={{
              width: `${100 / TABS.length}%`,
              left: `${(100 / TABS.length) * activeIndex}%`,
            }}
          />

          {TABS.map(t => (
            <TabButton
              key={t.id}
              active={tab === t.id}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </TabButton>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'products' && (
          <MarketplaceProductList marketplaceId={marketplace.id} />
        )}

        {tab === 'import' && (
          supportsOperationsTabs ? (
            <ImportProductsAction
              marketplace={operationsMarketplaceId}
            />
          ) : (
            <MarketplaceFeaturePlaceholder
              title="Imports not available yet"
              description="Fravega product browsing is enabled. Import runs will be connected when the marketplace workflow is ready."
            />
          )
        )}

        {tab === 'actions' && (
          supportsOperationsTabs ? (
            <div>
              <MarketplaceProductsHeader
                marketplaceId={operationsMarketplaceId}
              />
            </div>
          ) : (
            <MarketplaceFeaturePlaceholder
              title="Status summary not available yet"
              description="This section will show the publication status breakdown for Fravega once that endpoint is connected."
            />
          )
        )}
      </div>
    </div>
  );
}

function getOperationsMarketplaceId(
  marketplaceId: string
): 'megatone' | 'oncity' | null {
  if (marketplaceId === 'megatone' || marketplaceId === 'oncity') {
    return marketplaceId;
  }

  return null;
}

/* =========================
 * Tab Button
 * ========================= */
function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative z-10 flex-1 rounded-[16px] py-3 text-sm font-medium transition-all ${
        active
          ? 'text-white'
          : 'text-zinc-500 hover:text-zinc-200'
      }`}
    >
      {children}
    </button>
  );
}

function MarketplaceFeaturePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6">
      <div className="max-w-xl space-y-3">
        <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-300">
          Coming soon
        </span>
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
        <p className="text-sm text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}
