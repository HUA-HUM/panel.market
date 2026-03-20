import { MarketplaceGrid } from "@/src/features/marketplace/components/MarketplaceSelector/MarketplaceGrid";

export default function MarketplacePage() {
  return (
    <div className="min-h-screen w-full px-6 py-10">
      <div className="mx-auto max-w-[1500px] space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
            Marketplace Hub
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Marketplaces
          </h1>
          <p className="text-sm text-zinc-400">
            Select a channel to manage products, imports, and publication status.
          </p>
        </div>
        <MarketplaceGrid />
      </div>
    </div>
  );
}
