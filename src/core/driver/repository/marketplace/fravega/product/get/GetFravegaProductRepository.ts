import { IGetFravegaProductsRepository } from '@/src/core/adapters/repository/marketplace/fravega/products/get/IGetFravegaProductRepository';
import { MarketplaceProduct } from '@/src/core/entitis/marketplace/shared/products/get/MarketplaceProduct';
import { MarketplaceProductsListSummary, PaginatedResult } from '@/src/core/entitis/marketplace/shared/products/get/pagination/PaginatedResult';
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
    images?: string[];
    link_publicacion?: string;
    title?: string;
    raw_payload?: {
      id?: string;
      sku?: string;
      refId?: string;
      price?:
        | number
        | string
        | {
            net?: number;
            list?: number;
            sale?: number;
          };
      stock?:
        | number
        | {
            quantity?: number;
          };
      status?:
        | string
        | {
            code?: string;
            message?: string;
          };
      marketSku?: string;
      sellerSku?: string;
      publicationId?: string;
      title?: string;
      images?: string[];
      linkPublicacion?: string;
      itemState?: string;
      attributes?: Array<{
        t?: string;
        v?: string;
      }>;
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

const FRAVEGA_IMAGE_BASE_URL = 'https://images2.production.fravega.com/f300';

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

function mapFravegaItemToMarketplaceProduct(
  item: FravegaApiResponse['items'][number]
): MarketplaceProduct {
  const raw = item.raw_payload ?? {};

  return {
    publicationId:
      raw.publicationId ??
      raw.id ??
      item.external_id ??
      item.id,
    sellerSku:
      raw.sellerSku ??
      raw.refId ??
      item.seller_sku,
    marketSku: raw.marketSku ?? raw.sku,
    externalId: item.external_id,
    title:
      raw.title?.trim() ||
      item.title?.trim() ||
      raw.refId?.trim() ||
      raw.sellerSku?.trim() ||
      item.seller_sku ||
      item.external_id,
    price: resolveFravegaPrice(raw.price, item.price),
    stock: resolveFravegaStock(raw.stock, item.stock),
    status: mapFravegaStatus(item.status ?? raw.status ?? raw.itemState),
    rawStatus: resolveFravegaRawStatus(item.status ?? raw.status ?? raw.itemState),
    publicationUrl:
      raw.linkPublicacion ??
      (raw as { LinkPublicacion?: string }).LinkPublicacion ??
      item.link_publicacion,
    images: normalizeFravegaImages(
      raw.images ??
      extractFravegaImagesFromAttributes(raw.attributes) ??
      item.images
    ),
    lastSeenAt: item.last_seen_at,
  };
}

function normalizeFravegaImages(images?: string[]): string[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((image) => {
      if (typeof image !== 'string') {
        return null;
      }

      const normalizedImage = image.trim();

      if (!normalizedImage) {
        return null;
      }

      if (/^https?:\/\//i.test(normalizedImage)) {
        return normalizedImage;
      }

      return `${FRAVEGA_IMAGE_BASE_URL}/${normalizedImage}`;
    })
    .filter((image): image is string => Boolean(image));
}

function resolveFravegaPrice(
  price:
    | number
    | string
    | {
        net?: number;
        list?: number;
        sale?: number;
      }
    | undefined,
  fallback: string
) {
  if (typeof price === 'number' || typeof price === 'string') {
    return Number(price);
  }

  if (price && typeof price === 'object') {
    return Number(price.sale ?? price.net ?? price.list ?? 0);
  }

  return Number(fallback ?? 0);
}

function resolveFravegaStock(
  stock:
    | number
    | {
        quantity?: number;
      }
    | undefined,
  fallback: number
) {
  if (typeof stock === 'number') {
    return stock;
  }

  if (stock && typeof stock === 'object') {
    return Number(stock.quantity ?? 0);
  }

  return Number(fallback ?? 0);
}

function extractFravegaImagesFromAttributes(
  attributes?: Array<{ t?: string; v?: string }>
) {
  if (!Array.isArray(attributes)) {
    return undefined;
  }

  const images = attributes
    .filter(attribute => attribute.t === 'image' && typeof attribute.v === 'string')
    .map(attribute => attribute.v as string);

  return images.length > 0 ? images : undefined;
}

function resolveFravegaRawStatus(status: unknown): string {
  if (typeof status === 'string' && status.trim()) {
    return status.trim();
  }

  if (status && typeof status === 'object') {
    const statusRecord = status as Record<string, unknown>;
    const candidates = [statusRecord.code, statusRecord.message];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return 'UNKNOWN';
}

function mapFravegaStatus(status: unknown): MarketplaceProduct['status'] {
  switch (resolveFravegaRawStatus(status).toUpperCase()) {
    case 'ACTIVE':
    case 'ACTIVO':
      return 'ACTIVE';
    case 'PENDING':
    case 'PENDIENTE':
      return 'PENDING';
    case 'EN_REVISION':
    case 'PENDING-APPROVAL':
    case 'EDITING':
      return 'OTHER';
    case 'PAUSED':
    case 'PAUSADO':
    case 'INACTIVE':
    case 'INCOMPLETO':
    case 'INCOMPLETE':
      return 'PAUSED';
    default:
      return 'DELETED';
  }
}

function mapSummary(
  summary: FravegaApiResponse['summary']
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
