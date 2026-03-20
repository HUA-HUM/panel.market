import { MARKETPLACES } from '../../config/marketplaces';
import { MarketplaceCard } from './MarketplaceCard';

export function MarketplaceGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {MARKETPLACES.map(marketplace => (
        <MarketplaceCard
          key={marketplace.id}
          marketplace={marketplace}
        />
      ))}
    </div>
  );
}
