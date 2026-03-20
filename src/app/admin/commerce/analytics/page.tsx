'use client';

import ParentCategoriesDashboard from '@/src/features/Analytics/components/CategoriesPerformance/level-1/components/ParentCategoriesDashboard';
import { useRouter, usePathname } from 'next/navigation';

export default function AnalyticsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const activeSection = pathname.includes('all-products')
    ? 'products'
    : 'categories';

  return (
    <div className="min-h-screen w-full px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1600px] gap-6">
        <aside className="w-72 shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin/commerce')}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
            >
              ← Back
            </button>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
                Commerce Analytics
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                Analytics
              </h1>
            </div>

            <nav className="space-y-2 pt-2 text-sm">
              <SidebarItem
                label="Categories"
                active={activeSection === 'categories'}
                onClick={() => router.push('/admin/commerce/analytics')}
              />
              <SidebarItem
                label="Products"
                active={activeSection === 'products'}
                onClick={() => router.push('/admin/commerce/analytics/all-products')}
              />
              <SidebarItem label="Brands" disabled />
              <SidebarItem label="Best Sellers" disabled />
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-auto rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(8,12,26,0.98),rgba(7,11,18,0.98),rgba(4,7,16,1))] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          {activeSection === 'categories' && (
            <ParentCategoriesDashboard />
          )}

          {activeSection === 'products' && (
            <div>
              {/* Rendered from all-products page */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  active,
  onClick,
  disabled
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      className={`w-full rounded-2xl px-4 py-3 text-left transition ${
        disabled
          ? 'cursor-not-allowed text-zinc-600'
          : active
          ? 'bg-[linear-gradient(135deg,rgba(103,232,249,0.16),rgba(37,99,235,0.18))] text-white'
          : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}
