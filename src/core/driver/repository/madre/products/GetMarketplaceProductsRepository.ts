import {
  IGetMarketplaceProductsRepository,
  PaginatedMarketplaceProductsResponse,
} from '@/src/core/adapters/repository/madre/products/IGetMarketplaceProductsRepository';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';

type MarketplaceProductsApiResponse = PaginatedMarketplaceProductsResponse | {
  items: PaginatedMarketplaceProductsResponse['items'];
  total?: number;
  limit?: number;
  offset?: number;
};

export class GetMarketplaceProductsRepository
  implements IGetMarketplaceProductsRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: '/api',
      });
  }

  async execute(params: {
    offset: number;
    limit: number;
  }): Promise<PaginatedMarketplaceProductsResponse> {
    const { offset, limit } = params;

    const response = await this.http.get<MarketplaceProductsApiResponse>(
      `/madre/internal/marketplace/products/items/marketplaces?offset=${offset}&limit=${limit}`
    );

    return {
      items: Array.isArray(response.items) ? response.items : [],
      total: response.total ?? (Array.isArray(response.items) ? response.items.length : 0),
      limit: response.limit ?? limit,
      offset: response.offset ?? offset,
    };
  }
}
