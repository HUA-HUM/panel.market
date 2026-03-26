import { MarketplaceProduct } from '@/src/core/entitis/marketplace/shared/products/get/MarketplaceProduct';
import { useState } from 'react';

type Props = {
  product: MarketplaceProduct;
};

const PLACEHOLDER_IMAGE =
  'https://tiendaloquieroaca924.vtexassets.com/assets/vtex.catalog-images/products/examplePhoneImageBlue.png';

export function MarketplaceProductCard({ product }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const image =
    product.images?.[0] &&
    product.images[0] !== PLACEHOLDER_IMAGE
      ? product.images[0]
      : null;

  const normalizedStatus = product.status
    ?.toString()
    .toUpperCase()
    .trim();

  let statusBadge =
    'bg-white/[0.08] text-zinc-300';

  let statusLabel = normalizedStatus ?? 'Desconocido';

  switch (normalizedStatus) {
    case 'ACTIVE':
    case 'ACTIVO':
      statusBadge = 'bg-green-100 text-green-700';
      statusLabel = 'Activo';
      break;

    case 'PAUSED':
    case 'PAUSADO':
    case 'INACTIVE':
      statusBadge = 'bg-yellow-100 text-yellow-700';
      statusLabel = 'Pausado';
      break;

    case 'DELETED':
    case 'ELIMINADO':
      statusBadge = 'bg-red-100 text-red-700';
      statusLabel = 'Eliminado';
      break;
  }

  return (
    <div
      className="
      group rounded-[20px] border border-white/10 bg-black/20 p-3
      transition-all hover:border-white/20 hover:bg-white/[0.03]
      "
    >
      <div className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-white/[0.04]">
        {image && !imageFailed ? (
          // Marketplace image URLs can be inconsistent; a plain img is more tolerant here.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain p-2 transition-transform group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="text-center px-2">
            <div className="text-xs font-semibold text-zinc-300">
              No image
            </div>
            <div className="text-[10px] text-zinc-500">
              Incomplete product
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 space-y-1">
        <div className="truncate text-[10px] text-zinc-500">
          {product.sellerSku} · {product.publicationId}
        </div>
        <div className="line-clamp-2 text-xs font-semibold leading-tight text-white">
          {product.title}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">
          ${product.price.toLocaleString()}
        </span>
        <span className="rounded-md bg-white/[0.08] px-2 py-0.5 text-[10px] text-zinc-300">
          Stock {product.stock}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${statusBadge}`}
        >
          {statusLabel}
        </span>
      </div>
      {product.publicationUrl && (
        <a
          href={product.publicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
          mt-3 flex w-full items-center justify-center rounded-xl border border-white/10
          bg-white/[0.04] py-1.5 text-[11px] font-medium text-zinc-200 transition
          hover:border-white/20 hover:text-white
          "
        >
          View product
        </a>
      )}
    </div>
  );
}
