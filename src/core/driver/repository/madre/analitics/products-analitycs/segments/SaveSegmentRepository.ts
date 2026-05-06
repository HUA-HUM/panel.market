import { ISaveSegmentRepository } from '@/src/core/adapters/repository/madre/analitics/products-analitycs/segments/ISaveSegmentRepository';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';
import { ProductsFilters } from '@/src/core/entitis/madre/analitics/products-analitycs/ProductsFilters';

export class SaveSegmentRepository
  implements ISaveSegmentRepository
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
    segmentId: number;
    totalProducts: number;
  }> {
    const payload = {
      marketplaceId,
      filters,
    };

    console.log('[SaveSegmentRepository] POST', {
      url: '/api/analytics/products/segments',
      payload,
    });

    const response = await this.http.post<{
      success: boolean;
      segmentId: number;
      totalProducts: number;
    }>(
      '/api/analytics/products/segments',
      payload
    );

    console.log('[SaveSegmentRepository] Response', response);

    return response;
  }
}
