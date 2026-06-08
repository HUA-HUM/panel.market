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
    sku?: string;
    status?: 'ACTIVE' | 'ERROR';
  }): Promise<PaginatedMarketplaceProductsResponse> {
    const query = new URLSearchParams({
      offset: String(params.offset),
      limit: String(params.limit),
    });

    if (params.sku?.trim()) {
      query.set('sku', params.sku.trim());
    }

    if (params.status) {
      query.set('status', params.status);
    }

    const response = await this.http.get<MarketplaceProductsApiResponse>(
      `/madre/internal/marketplace/products/items/marketplaces?${query}`
    );

    return {
      items: Array.isArray(response.items) ? response.items : [],
      total: response.total ?? (Array.isArray(response.items) ? response.items.length : 0),
      limit: response.limit ?? params.limit,
      offset: response.offset ?? params.offset,
    };
  }
}
