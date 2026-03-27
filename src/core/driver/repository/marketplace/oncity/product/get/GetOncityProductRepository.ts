import { IGetOncityProductsRepository } from '@/src/core/adapters/repository/marketplace/oncity/products/get/IGetOncityProductRepository';
import { MarketplaceProduct } from '@/src/core/entitis/marketplace/shared/products/get/MarketplaceProduct';
import { MarketplaceProductsListSummary, PaginatedResult } from '@/src/core/entitis/marketplace/shared/products/get/pagination/PaginatedResult';
import { HttpClient } from '../../../../http/httpClient';
import { mapRawPayloadToMarketplaceProduct } from '../../../mapper/mapRawPayloadToMarketplaceProduct';

type OncityApiResponse = {
  items: Array<{
    id: string;
    seller_sku: string;
    external_id: string;
    price: string;
    stock: number;
    status: string;
    last_seen_at?: string;
    raw_payload: Record<string, unknown>;
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

export class GetOncityProductsRepository
  implements IGetOncityProductsRepository
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

  const response = await this.http.get<OncityApiResponse>(
    `/api/internal/marketplace/products/items/all?marketplace=oncity&offset=${offset}&limit=${limit}`
  );

  const items = response.items
    .map(item => mapRawPayloadToMarketplaceProduct(buildMarketplaceRawPayload(item)))
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

function buildMarketplaceRawPayload(
  item: OncityApiResponse['items'][number]
): Parameters<typeof mapRawPayloadToMarketplaceProduct>[0] {
  const raw = item.raw_payload ?? {};

  return {
    ...raw,
    publicationId:
      (readRecordValue(raw, 'publicationId') as string | number | undefined) ??
      item.external_id ??
      item.id,
    sellerSku:
      (readRecordValue(raw, 'sellerSku') as string | undefined) ??
      item.seller_sku,
    externalId: item.external_id,
    price: Number(
      (readRecordValue(raw, 'price') as number | string | undefined) ??
        item.price ??
        0
    ),
    stock:
      (readRecordValue(raw, 'stock') as number | undefined) ??
      item.stock,
    status:
      item.status ??
      String(readRecordValue(raw, 'status') ?? 'DELETED'),
    last_seen_at: item.last_seen_at,
  };
}

function readRecordValue(record: Record<string, unknown>, key: string) {
  return key in record ? record[key] : undefined;
}

function mapSummary(
  summary: OncityApiResponse['summary']
): MarketplaceProductsListSummary | undefined {
  if (!summary) {
    return undefined;
  }

  return {
    marketplace: summary.marketplace,
    total: summary.total,
    statuses: summary.statuses.map(item => ({
      status: item.status as MarketplaceProduct['status'],
      total: Number(item.total),
      percentage: Number(item.percentage ?? 0),
    })),
    statusMap: summary.statusMap as MarketplaceProductsListSummary['statusMap'],
    statusPercentageMap:
      summary.statusPercentageMap as MarketplaceProductsListSummary['statusPercentageMap'],
  };
}
