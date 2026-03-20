'use client';

import { Marketplace } from "@/src/core/entitis/madre/analitics/favorites/folder/status/marketplace.types";

type Props = {
  marketplaces: Marketplace[];
  selected?: number;
  onSelect: (id: number) => void;
  onCreate: () => void;
};

export function MarketplaceTabs({
  marketplaces,
  selected,
  onSelect,
  onCreate,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {marketplaces.map((marketplace) => {
        const isActive = selected === marketplace.id;
        const isClosed = marketplace.status === 'closed';

        return (
          <button
            key={marketplace.id}
            onClick={() => onSelect(marketplace.id)}
            className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition-all
              ${
                isActive
                  ? 'bg-[linear-gradient(135deg,rgba(103,232,249,0.16),rgba(37,99,235,0.18))] text-white shadow-[0_16px_40px_rgba(37,99,235,0.15)]'
                  : 'border border-white/8 bg-white/[0.03] text-zinc-400 hover:border-white/14 hover:text-white'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <span>{marketplace.name}</span>

              {isClosed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 10-8 0v4M5 11h14v9H5z"
                  />
                </svg>
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>
          </button>
        );
      })}

      {/* BOTÓN CREAR */}
      <button
        type="button"
        onClick={onCreate}
        className="rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] px-4 py-2.5 text-sm font-medium text-white transition hover:scale-[1.01]"
      >
        + New folder
      </button>
    </div>
  );
}
