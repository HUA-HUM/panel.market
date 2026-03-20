'use client';

import FavoritesDashboard from '@/src/features/Analytics/components/favorites/dashboard/FavoritesDashboard';
import { useRouter } from 'next/navigation';

export default function StrategiesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full px-6 py-10 text-white">
      <div className="mx-auto max-w-[1600px] space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <button
              onClick={() => router.push('/admin/commerce')}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
            >
              ← Back
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
                Strategic Products
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                Favorites
              </h1>
            </div>
          </div>
        </div>

        <FavoritesDashboard />
      </div>
    </div>
  );
}
