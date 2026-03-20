export function MarketplaceProductSkeleton() {
  return (
    <div
      className="
        space-y-2 rounded-[20px] border border-white/10 bg-black/20 p-3
        animate-pulse
      "
    >
      <div className="h-24 w-full rounded-xl bg-white/[0.06]" />
      <div className="h-2 w-2/3 rounded bg-white/[0.08]" />
      <div className="h-3 w-full rounded bg-white/[0.08]" />
      <div className="h-3 w-5/6 rounded bg-white/[0.08]" />
      <div className="flex justify-between gap-2">
        <div className="h-3 w-1/3 rounded bg-white/[0.08]" />
        <div className="h-3 w-1/4 rounded bg-white/[0.08]" />
      </div>
      <div className="h-4 w-16 rounded-full bg-white/[0.08]" />
    </div>
  );
}
