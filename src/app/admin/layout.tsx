'use client';

import Sidebar from '@/src/components/layout/Sidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSidebar = pathname.startsWith('/admin/commerce');

  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#050814,#0a1020_38%,#0d1424)]">
      {!hideSidebar && <Sidebar />}

      <main className="relative min-w-0 flex-1 overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_55%)]" />
          <div className="absolute right-0 top-0 h-64 w-64 bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_70%)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:88px_88px] opacity-[0.04]" />
        </div>
        <div className="relative">{children}</div>
      </main>
    </div>
  );
}
