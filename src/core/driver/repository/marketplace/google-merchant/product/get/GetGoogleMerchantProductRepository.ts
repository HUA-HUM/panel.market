import { IGetGoogleMerchantProductsRepository } from '@/src/core/adapters/repository/marketplace/google-merchant/products/get/IGetGoogleMerchantProductRepository';
import { MarketplaceProduct } from '@/src/core/entitis/marketplace/shared/products/get/MarketplaceProduct';
import { MarketplaceProductsListSummary, PaginatedResult } from '@/src/core/entitis/marketplace/shared/products/get/pagination/PaginatedResult';
import { HttpClient } from '../../../../http/httpClient';

type GoogleMerchantApiResponse = {
  items: Array<{
    id: string;
    seller_sku: string;
    external_id: string;
    price: string;
    stock: number;
    status: string;
    last_seen_at?: string;
    raw_payload?: {
      offerId?: string;
      productAttributes?: {
        title?: string;
        imageLink?: string;
        additionalImageLinks?: string[];
        link?: string;
      };
    };
  }>;
  total: number;
  limit: number;
  offset: number;
  count?: number;
  summary?: {
    marketplace: string;
    total: number;
    statuses: Array<{
      status: string;
      total: number;
      percentage: number;
    }>;
    statusMap: Record<string, number>;
    statusPercentageMap: Record<string, number>;
  };
  hasNext?: boolean;
  nextOffset?: number;
};

export class GetGoogleMerchantProductsRepository
  implements IGetGoogleMerchantProductsRepository
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
    sku?: string;
    status?: 'ACTIVE' | 'ERROR';
  }): Promise<PaginatedResult<MarketplaceProduct>> {
    const query = buildProductsQuery('google-merchant', params);

    const response = await this.http.get<GoogleMerchantApiResponse>(
      `/api/internal/marketplace/products/items/all?${query}`
    );

    const items = response.items
      .map(mapGoogleMerchantItemToMarketplaceProduct)
      .sort((a, b) => {
        const order: Record<MarketplaceProduct['status'], number> = {
          ACTIVE: 0,
          PAUSED: 1,
          PENDING: 2,
          DELETED: 3,
          OTHER: 4,
        };

        return order[a.status] - order[b.status];
      });

    return {
      items,
      total: response.total,
      limit: response.limit,
      offset: response.offset,
      count: response.count,
      summary: mapSummary(response.summary),
      hasNext:
        response.hasNext ??
        response.offset + response.limit < response.total,
      nextOffset:
        response.nextOffset ??
        response.offset + response.limit,
    };
  }
}

function buildProductsQuery(
  marketplace: string,
  params: {
    offset: number;
    limit: number;
    sku?: string;
    status?: 'ACTIVE' | 'ERROR';
  }
) {
  const query = new URLSearchParams({
    marketplace,
    offset: String(params.offset),
    limit: String(params.limit),
  });

  if (params.sku?.trim()) {
    query.set('sku', params.sku.trim());
  }

  if (params.status) {
    query.set('status', params.status);
  }

  return query.toString();
}

function mapGoogleMerchantItemToMarketplaceProduct(
  item: GoogleMerchantApiResponse['items'][number]
): MarketplaceProduct {
  const raw = item.raw_payload ?? {};
  const attributes = raw.productAttributes;

  return {
    publicationId: item.external_id ?? item.id,
    sellerSku: raw.offerId ?? item.seller_sku,
    marketSku: raw.offerId ?? item.seller_sku,
    externalId: item.external_id,
    title:
      attributes?.title?.trim() ||
      raw.offerId?.trim() ||
      item.seller_sku,
    price: Number(item.price ?? 0),
    stock: item.stock ?? 0,
    status: mapGoogleMerchantStatus(item.status),
    rawStatus: item.status,
    publicationUrl: attributes?.link,
    images: [
      attributes?.imageLink,
      ...(attributes?.additionalImageLinks ?? []),
    ].filter((value): value is string => Boolean(value && value.trim())),
    lastSeenAt: item.last_seen_at,
  };
}

function mapGoogleMerchantStatus(status: string): MarketplaceProduct['status'] {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return 'ACTIVE';
    case 'PENDING':
      return 'PENDING';
    case 'PAUSED':
    case 'INACTIVE':
      return 'PAUSED';
    case 'ERROR':
      return 'OTHER';
    default:
      return 'DELETED';
  }
}

function mapSummary(
  summary: GoogleMerchantApiResponse['summary']
): MarketplaceProductsListSummary | undefined {
  if (!summary) {
    return undefined;
  }

  return {
    marketplace: summary.marketplace,
    total: summary.total,
    statuses: summary.statuses.map(item => ({
      status: item.status,
      total: Number(item.total),
      percentage: Number(item.percentage ?? 0),
    })),
    statusMap: summary.statusMap,
    statusPercentageMap: summary.statusPercentageMap,
  };
}
