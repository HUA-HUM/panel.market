import { MarketplaceProduct } from '@/src/core/entitis/marketplace/shared/products/get/MarketplaceProduct';

type RawPayload = {
  publicationId: number | string;
  sellerSku: string;
  marketSku?: string;
  title?: string;
  price: number;
  stock: number;
  status: string;
  images?: string[];
  linkPublicacion?: string;
  [key: string]: unknown;
};

export function mapRawPayloadToMarketplaceProduct(
  raw: RawPayload
): MarketplaceProduct {
  return {
    publicationId: raw.publicationId,
    sellerSku: raw.sellerSku,
    marketSku: raw.marketSku,
    externalId: resolveExternalId(raw),
    title: resolveTitle(raw),
    price: Number(raw.price),
    stock: raw.stock,
    status: mapStatus(raw.status),
    rawStatus: resolveRawStatus(raw.status),
    publicationUrl: resolvePublicationUrl(raw),
    images: resolveImages(raw),
    lastSeenAt: resolveLastSeenAt(raw),
  };
}

function resolveTitle(raw: RawPayload): string {
  const directCandidates = [raw.title, raw.nombre, raw.name, raw.productName];

  for (const candidate of directCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  return String(raw.sellerSku ?? raw.publicationId ?? 'Untitled product');
}

function resolvePublicationUrl(raw: RawPayload): string | undefined {
  const candidates = [
    raw.linkPublicacion,
    raw.LinkPublicacion,
    raw.publicationUrl,
    raw.productUrl,
    raw.urlPublicacion,
    raw.url,
    raw.permalink,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  return undefined;
}

function resolveExternalId(raw: RawPayload): string | undefined {
  const candidates = [
    raw.externalId,
    raw.external_id,
    raw.idExterno,
  ];

  for (const candidate of candidates) {
    if (
      (typeof candidate === 'string' && candidate.trim()) ||
      typeof candidate === 'number'
    ) {
      return String(candidate).trim();
    }
  }

  return undefined;
}

function resolveLastSeenAt(raw: RawPayload): string | undefined {
  const candidates = [
    raw.lastSeenAt,
    raw.last_seen_at,
    raw.updatedAt,
    raw.updated_at,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  return undefined;
}

function resolveImages(raw: RawPayload): string[] {
  const arrayCandidates = [
    raw.images,
    raw.imageUrls,
    raw.image_urls,
    raw.pictures,
    raw.fotos,
  ];

  for (const candidate of arrayCandidates) {
    if (Array.isArray(candidate)) {
      const mapped = candidate
        .map((entry) => {
          if (typeof entry === 'string') {
            return entry.trim();
          }

          if (entry && typeof entry === 'object') {
            const objectEntry = entry as Record<string, unknown>;
            const nestedCandidates = [
              objectEntry.url,
              objectEntry.src,
              objectEntry.link,
              objectEntry.image,
            ];

            return nestedCandidates.find(
              (value): value is string => typeof value === 'string' && value.trim().length > 0
            )?.trim();
          }

          return undefined;
        })
        .filter((value): value is string => Boolean(value));

      if (mapped.length > 0) {
        return mapped;
      }
    }
  }

  const singleCandidates = [
    raw.image,
    raw.imageUrl,
    raw.image_url,
    raw.thumbnail,
    raw.linkImagen,
    raw.urlImagen,
    raw.imagen,
    raw.foto,
    raw.imagenPrincipal,
    raw.fotoPrincipal,
  ];

  for (const candidate of singleCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return [candidate.trim()];
    }
  }

  return [];
}

function mapStatus(status: string): MarketplaceProduct['status'] {
  switch (resolveRawStatus(status)?.toUpperCase()) {
    case 'ACTIVO':
    case 'ACTIVE':
      return 'ACTIVE';
    case 'PENDING':
    case 'Pendiente':
    case 'PENDIENTE':
    case 'Pendiente_Activacion':
    case 'PENDIENTE_ACTIVACION':
      return 'PENDING';
    case 'Pausado':
    case 'PAUSED':
      return 'PAUSED';
    default:
      return 'DELETED';
  }
}

function resolveRawStatus(status: unknown): string | undefined {
  if (typeof status === 'string' && status.trim()) {
    return status.trim();
  }

  if (status && typeof status === 'object') {
    const value = status as Record<string, unknown>;
    const candidates = [value.code, value.message, value.status, value.state];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return undefined;
}
