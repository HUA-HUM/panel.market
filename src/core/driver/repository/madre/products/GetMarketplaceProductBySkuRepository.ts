import {
  IGetMarketplaceProductBySkuRepository,
  MarketplaceProductPresence,
} from '@/src/core/adapters/repository/madre/products/IGetMarketplaceProductBySkuRepository';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';

export class GetMarketplaceProductBySkuRepository
  implements IGetMarketplaceProductBySkuRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: '/api',
      });
  }

  execute(sellerSku: string): Promise<MarketplaceProductPresence> {
    return this.http.get<MarketplaceProductPresence>(
      `/madre/internal/marketplace/products/items/${encodeURIComponent(sellerSku)}/marketplaces`
    );
  }
}
