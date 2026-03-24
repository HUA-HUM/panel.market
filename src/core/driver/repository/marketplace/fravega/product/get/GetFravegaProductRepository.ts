import { IGetFravegaProductsRepository } from '@/src/core/adapters/repository/marketplace/fravega/products/get/IGetFravegaProductRepository';
import { MarketplaceProduct } from '@/src/core/entitis/marketplace/shared/products/get/MarketplaceProduct';
import { PaginatedResult } from '@/src/core/entitis/marketplace/shared/products/get/pagination/PaginatedResult';
import { HttpClient } from '../../../../http/httpClient';

type FravegaApiResponse = {
  items: Array<{
    id: string;
    seller_sku: string;
    external_id: string;
    price: string;
    stock: number;
    status: string;
    last_seen_at?: string;
    raw_payload?: {
      price?: number | string;
      stock?: number;
      status?: string;
      marketSku?: string;
      sellerSku?: string;
      publicationId?: string;
      title?: string;
      images?: string[];
      linkPublicacion?: string;
    };
  }>;
  total: number;
  limit: number;
  offset: number;
  hasNext?: boolean;
  nextOffset?: number;
};

export class GetFravegaProductsRepository
  implements IGetFravegaProductsRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: process.env.NEXT_PUBLIC_MADRE_API_URL!,
      });
  }

  async execute(params: {
    offset: number;
    limit: number;
  }): Promise<PaginatedResult<MarketplaceProduct>> {
    const { offset, limit } = params;

    const response = await this.http.get<FravegaApiResponse>(
      `/api/internal/marketplace/products/items/all?marketplace=fravega&offset=${offset}&limit=${limit}`
    );

    const items = response.items
      .map((item) => mapFravegaItemToMarketplaceProduct(item))
      .sort((a, b) => {
        const order: Record<MarketplaceProduct['status'], number> = {
          ACTIVE: 0,
          PAUSED: 1,
          DELETED: 2,
        };

        return order[a.status] - order[b.status];
      });

    return {
      items,
      total: response.total,
      limit: response.limit,
      offset: response.offset,
      hasNext:
        response.hasNext ??
        response.offset + response.limit < response.total,
      nextOffset:
        response.nextOffset ??
        response.offset + response.limit,
    };
  }
}

function mapFravegaItemToMarketplaceProduct(
  item: FravegaApiResponse['items'][number]
): MarketplaceProduct {
  const raw = item.raw_payload ?? {};

  return {
    publicationId: raw.publicationId ?? item.external_id ?? item.id,
    sellerSku: raw.sellerSku ?? item.seller_sku,
    marketSku: raw.marketSku,
    title:
      raw.title?.trim() ||
      raw.sellerSku?.trim() ||
      item.seller_sku ||
      item.external_id,
    price: Number(raw.price ?? item.price ?? 0),
    stock: raw.stock ?? item.stock ?? 0,
    status: mapFravegaStatus(raw.status ?? item.status),
    publicationUrl: raw.linkPublicacion,
    images: raw.images ?? [],
  };
}

function mapFravegaStatus(status: string): MarketplaceProduct['status'] {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
    case 'ACTIVO':
      return 'ACTIVE';
    case 'PAUSED':
    case 'PAUSADO':
    case 'INACTIVE':
    case 'INCOMPLETO':
    case 'INCOMPLETE':
    case 'PENDING':
      return 'PAUSED';
    default:
      return 'DELETED';
  }
}
