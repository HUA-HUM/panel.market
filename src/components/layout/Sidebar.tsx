'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {

  const rawPathname = usePathname();
  const pathname = rawPathname?.replace(/\/$/, '') || '';

  const hideSidebar = pathname.startsWith('/admin/commerce');
  if (hideSidebar) return null;

  const isAnalyticsRoot =
    pathname === '/admin/commerce/analytics' ||
    pathname === '/admin/commerce/favorites';

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isAnalyticsRoot) {
      setCollapsed(true);
    }
  }, [isAnalyticsRoot]);

  return (
    <aside
      className={`
        relative flex h-full flex-col bg-zinc-950 text-gray-200
        border-r border-zinc-800
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-14' : 'w-64'}
      `}
    >

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className="absolute right-[-12px] top-1/2 -translate-y-1/2
                   h-8 w-8 rounded-full bg-zinc-900
                   border border-zinc-700
                   flex items-center justify-center
                   hover:bg-zinc-800 transition shadow-md"
      >
        <ChevronIcon collapsed={collapsed} />
      </button>

      {/* Logo */}
      {!collapsed && (
        <div className="flex justify-center border-b border-zinc-800 py-6">
          <div className="relative h-10 w-10">
            <Image
              src="/LQA-logo.png"
              alt="LQA Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-2 py-4 text-sm">

        {/* Marketplace */}
        <SidebarLink
          href="/admin/marketplace"
          label="Marketplace"
          active={pathname.startsWith('/admin/marketplace')}
          collapsed={collapsed}
        />

        {/* Productos */}
        <SidebarLink
          href="/admin/products"
          label="Products"
          active={pathname.startsWith('/admin/products')}
          collapsed={collapsed}
        />


        {/* publicaador */}
       <SidebarLink
  href="/admin/publish"
  label="Publisher"
  active={pathname.startsWith('/admin/publish')}
  collapsed={collapsed}
/>

        {/* Commerce */}
        <SidebarLink
          href="/admin/commerce"
          label="Commerce"
          active={pathname.startsWith('/admin/commerce')}
          collapsed={collapsed}
          newTab
        />

      </nav>
    </aside>
  );
}


/* ================= LINK ================= */

function SidebarLink({
  href,
  label,
  active,
  collapsed,
  newTab = false
}: {
  href: string;
  label: string;
  active: boolean;
  collapsed: boolean;
  newTab?: boolean;
}) {

  return (
    <Link
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className={`
        flex items-center justify-center rounded-lg py-3 transition
        ${
          active
            ? 'bg-zinc-800 text-white'
            : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
        }
      `}
    >
      {collapsed ? <DotIcon /> : label}
    </Link>
  );
}


/* ================= DOT ================= */

function DotIcon() {
  return (
    <div className="h-2 w-2 rounded-full bg-current opacity-70" />
  );
}


/* ================= CHEVRON ================= */

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-300 ${
        collapsed ? 'rotate-180' : ''
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}