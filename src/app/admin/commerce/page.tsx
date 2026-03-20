'use client';

import { useRouter } from 'next/navigation';

const MODULES = [
  {
    title: 'Analytics',
    description: 'Categories, products, and performance insights.',
    badge: 'Insight',
    href: '/admin/commerce/analytics',
  },
  {
    title: 'Strategy',
    description: 'Strategic folders, selections, and opportunity tracking.',
    badge: 'Action',
    href: '/admin/commerce/favorites',
  },
];

export default function CommerceHub() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full px-6 py-10 text-white">
      <div className="mx-auto max-w-[1500px]">
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

          <div className="relative space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
                Commerce Hub
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Commerce
                </h1>
                <p className="text-sm text-zinc-400 md:text-base">
                  Analytics and strategy, organized in one workspace.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {MODULES.map((module) => (
                <ModuleCard
                  key={module.title}
                  title={module.title}
                  description={module.description}
                  badge={module.badge}
                  onClick={() => router.push(module.href)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({
  title,
  description,
  badge,
  onClick
}: {
  title: string;
  description: string;
  badge: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        group relative overflow-hidden rounded-[28px] border border-white/10
        bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]
        p-6 text-left transition-all duration-300
        hover:-translate-y-1 hover:border-cyan-300/20
        hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]
      "
    >
      <div className="pointer-events-none absolute -right-10 top-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full min-h-[240px] flex-col justify-between">
        <div className="space-y-5">
          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
            {badge}
          </span>

          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              {title}
            </h2>
            <p className="max-w-sm text-sm leading-6 text-zinc-400">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-8">
          <span className="text-sm text-zinc-500">
            Open module
          </span>
          <span className="text-sm font-medium text-cyan-200 transition group-hover:translate-x-1">
            Enter →
          </span>
        </div>
      </div>
    </button>
  );
}
