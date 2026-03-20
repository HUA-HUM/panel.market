import Image from 'next/image';
import Link from 'next/link';
import { Marketplace } from '../../config/marketplaces';

type Props = {
  marketplace: Marketplace;
};

export function MarketplaceCard({ marketplace }: Props) {
  return (
    <Link
      href={`/admin/marketplace/${marketplace.id}`}
      className="
        group relative overflow-hidden rounded-[28px] border border-white/10
        bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]
        p-6 backdrop-blur-xl transition-all duration-300
        hover:-translate-y-1 hover:border-cyan-300/20
        hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]
      "
    >
      <div
        className="
          pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100
        "
      >
        <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
      </div>

      <div className="relative space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Marketplace
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {marketplace.name}
            </h3>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
            Open
          </span>
        </div>

        <div className="flex min-h-[140px] items-center justify-center rounded-[24px] border border-white/8 bg-black/20 p-6">
          <div className="relative h-20 w-40 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={marketplace.logo}
              alt={marketplace.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
