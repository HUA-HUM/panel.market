'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {

  const rawPathname = usePathname();
  const pathname = rawPathname?.replace(/\/$/, '') || '';

  const hideSidebar = pathname.startsWith('/admin/commerce');
  const isAnalyticsRoot =
    pathname === '/admin/commerce/analytics' ||
    pathname === '/admin/commerce/favorites';

  const [manualCollapsed, setManualCollapsed] = useState(false);
  const collapsed = isAnalyticsRoot || manualCollapsed;

  if (hideSidebar) return null;

  return (
    <div
      className={`
        relative shrink-0 transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-72'}
      `}
    >
      <aside
        className={`
          fixed left-0 top-0 z-40 flex h-screen flex-col overflow-hidden
          border-r border-white/10 bg-[linear-gradient(180deg,rgba(7,10,18,0.98),rgba(11,15,28,0.98))]
          text-gray-200 shadow-[0_20px_80px_rgba(0,0,0,0.45)]
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-72'}
        `}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.06]" />
        </div>

        <button
          onClick={() => setManualCollapsed(v => !v)}
          className="absolute -right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/20 bg-zinc-950 text-cyan-100 shadow-lg transition hover:bg-zinc-900"
        >
          <ChevronIcon collapsed={collapsed} />
        </button>

        <div className="relative border-b border-white/10 px-4 py-5">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2">
              <Image
                src="/LQA-logo.png"
                alt="LQA Logo"
                fill
                className="object-contain p-2"
                priority
              />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/70">
                  Control Deck
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-white">
                  Lo Quiero ACA
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Operations console
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-3 py-4">
          {!collapsed && (
            <p className="mb-3 px-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              Navigation
            </p>
          )}

          <nav className="space-y-2 text-sm">
            <SidebarLink
              href="/admin/marketplace"
              label="Marketplace"
              icon={<GridIcon />}
              active={pathname.startsWith('/admin/marketplace')}
              collapsed={collapsed}
            />
            <SidebarLink
              href="/admin/products"
              label="Orders"
              icon={<BoxIcon />}
              active={pathname.startsWith('/admin/products')}
              collapsed={collapsed}
            />
            <SidebarLink
              href="/admin/publish"
              label="Publisher"
              icon={<PulseIcon />}
              active={pathname.startsWith('/admin/publish')}
              collapsed={collapsed}
            />
            <SidebarLink
              href="/admin/commerce"
              label="Commerce"
              icon={<LaunchIcon />}
              active={pathname.startsWith('/admin/commerce')}
              collapsed={collapsed}
              newTab
            />
          </nav>
        </div>

        {!collapsed && (
          <div className="relative border-t border-white/10 px-4 py-4">
            <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/10 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-100/70">
                Workspace
              </p>
              <p className="mt-1 text-sm font-medium text-white">Admin Console</p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}


/* ================= LINK ================= */

function SidebarLink({
  href,
  label,
  icon,
  active,
  collapsed,
  newTab = false
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
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
        group relative flex items-center rounded-2xl px-3 py-3 transition
        ${
          active
            ? 'bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(37,99,235,0.18))] text-white shadow-[0_12px_32px_rgba(34,211,238,0.12)]'
            : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
        }
      `}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-cyan-300" />
      )}
      <span className={`flex w-full items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
        {collapsed ? (
          <span className={active ? 'text-cyan-200' : 'text-zinc-400'}>
            {icon}
          </span>
        ) : (
          <>
            <span
              className={`
                flex h-10 w-10 items-center justify-center rounded-xl border transition
                ${
                  active
                    ? 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100'
                    : 'border-white/8 bg-white/[0.03] text-zinc-400 group-hover:border-white/14 group-hover:text-white'
                }
              `}
            >
              {icon}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">{label}</span>
              <span className="block text-xs text-zinc-500">
                {active ? 'Current section' : 'Navigate'}
              </span>
            </span>
          </>
        )}
      </span>
    </Link>
  );
}


function GridIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 4 7l8 4 8-4-8-4Z" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="M12 11v10" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12h4l2.5-5 4 10 2.5-5H21" />
    </svg>
  );
}

function LaunchIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
      <path d="M7 7h4M17 13v4H7V7" />
    </svg>
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
