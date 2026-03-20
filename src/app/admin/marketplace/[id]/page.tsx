import { MARKETPLACES } from '@/src/features/marketplace/config/marketplaces';
import MarketplaceDetailClient from './MarketplaceDetailClient';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MarketplaceDetailPage({ params }: Props) {
  const { id } = await params;

  const marketplace = MARKETPLACES.find(m => m.id === id);

  if (!marketplace) {
    return (
      <div className="min-h-screen w-full px-6 py-10">
        <div className="mx-auto max-w-[1200px] rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(8,12,26,0.98),rgba(7,11,18,0.98),rgba(4,7,16,1))] p-10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <h2 className="text-2xl font-semibold text-white">
            Marketplace not found
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            The requested marketplace does not exist in this workspace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-6 py-10">
      <div className="mx-auto max-w-[1500px]">
        <MarketplaceDetailClient marketplace={marketplace} />
      </div>
    </div>
  );
}
