import { HttpClient } from '@/src/core/driver/repository/http/httpClient';
import { IGetProductsOverviewRepository } from '@/src/core/adapters/repository/madre/analitics/products-analitycs/products/IGetProductsOverviewRepository';
import { ProductsOverview } from '@/src/core/entitis/madre/analitics/products-analitycs/ProductsOverview';
import { ProductsFilters } from '@/src/core/entitis/madre/analitics/products-analitycs/ProductsFilters';

export class GetProductsOverviewRepository
  implements IGetProductsOverviewRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: process.env.NEXT_PUBLIC_MADRE_API_URL!,
      });
  }

async execute(filters: ProductsFilters): Promise<ProductsOverview> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    const backendKey = key === 'inMarketplace' ? 'marketplaceId' : key;

    if (Array.isArray(value)) {
      value.forEach(v => params.append(backendKey, v));
    } else {
      params.append(backendKey, String(value));
    }
  });

  const queryString = params.toString();
  const finalUrl = `/api/analytics/products/overview?${queryString}`;

  console.log('[GetProductsOverviewRepository] GET', {
    url: finalUrl,
    filters,
  });

  const response = await this.http.get<ProductsOverview>(finalUrl);

  console.log('[GetProductsOverviewRepository] Response', response);

  return response;
}
}
