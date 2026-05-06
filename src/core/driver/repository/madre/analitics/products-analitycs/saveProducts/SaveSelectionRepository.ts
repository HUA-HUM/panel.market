import { ISaveSelectionRepository } from '@/src/core/adapters/repository/madre/analitics/products-analitycs/saveproducts/ISaveSelectionRepository';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';
import { ProductsFilters } from '@/src/core/entitis/madre/analitics/products-analitycs/ProductsFilters';

export class SaveSelectionRepository
  implements ISaveSelectionRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: process.env.NEXT_PUBLIC_MADRE_API_URL!,
      });
  }

  async execute(
    marketplaceId: number,
    filters: ProductsFilters
  ): Promise<{
    success: boolean;
    totalProducts: number;
  }> {
    const payload = {
      marketplaceId,
      filters,
    };

    console.log('[SaveSelectionRepository] POST', {
      url: '/api/analytics/products/save-selection',
      payload,
    });

    const response = await this.http.post<{
      success: boolean;
      totalProducts: number;
    }>(
      '/api/analytics/products/save-selection',
      payload
    );

    console.log('[SaveSelectionRepository] Response', response);

    return response;
  }
}
