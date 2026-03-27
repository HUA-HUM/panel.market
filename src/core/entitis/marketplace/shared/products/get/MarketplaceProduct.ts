export type MarketplaceProduct = {
  /** ID de la publicación en el marketplace */
  publicationId: number | string;

  /** SKU del seller (tu SKU interno) */
  sellerSku: string;

  /** SKU del marketplace */
  marketSku?: string;

  /** ID externo del marketplace */
  externalId?: string;

  /** Título público */
  title: string;

  /** Precio final */
  price: number;

  /** Stock disponible */
  stock: number;

  /** Estado normalizado */
  status: MarketplaceProductStatus;

  /** Estado textual exacto devuelto por el marketplace */
  rawStatus?: string;

  /** URL pública del producto */
  publicationUrl?: string;

  /** Imágenes públicas */
  images: string[];

  /** Fecha de última detección en el marketplace */
  lastSeenAt?: string;
};

export type MarketplaceProductStatus =
  | 'ACTIVE'
  | 'PAUSED'
  | 'DELETED'
  | 'PENDING'
  | 'OTHER';
