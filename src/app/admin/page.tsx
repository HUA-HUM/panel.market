'use client';

const SECTIONS = [
  {
    title: 'Orders',
    subtitle: 'Order status, volume, and pending actions.',
    items: ['Recent orders', 'Pending approvals', 'Order health'],
  },
  {
    title: 'Commerce Updates',
    subtitle: 'Important marketplace and business updates.',
    items: ['Marketplace changes', 'Catalog updates', 'System notices'],
  },
  {
    title: 'Shipping',
    subtitle: 'Shipment flow and delivery-related signals.',
    items: ['Pending shipments', 'In transit', 'Shipping issues'],
  },
  {
    title: 'Publisher',
    subtitle: 'Publication runs and marketplace publishing activity.',
    items: ['Latest runs', 'Pending jobs', 'Publishing alerts'],
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="min-h-screen w-full px-6 py-10">
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="
            relative overflow-hidden rounded-[30px] border border-white/10
            bg-[linear-gradient(145deg,rgba(8,12,26,0.98),rgba(7,11,18,0.98),rgba(4,7,16,1))]
            p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)]
            md:p-8
          "
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.26),transparent_55%)]" />
            <div className="absolute right-0 top-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.024)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:84px_84px] opacity-[0.04]" />
          </div>

          <div className="relative space-y-6">
            <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
                  Admin Overview
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Overview
                </h1>
              </div>

              <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
                Preview
              </span>
            </section>

            <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
              {SECTIONS.map((section) => (
                <OverviewSectionCard
                  key={section.title}
                  title={section.title}
                  subtitle={section.subtitle}
                  items={section.items}
                />
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSectionCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black/20 p-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />

      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-white">
              {title}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {subtitle}
            </p>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
            Soon
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              <span className="text-sm text-zinc-300">
                {item}
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
