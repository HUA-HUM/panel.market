import { ImageResponse } from 'next/og';
import { PwaIcon } from '@/src/app/pwa-icon';

export const runtime = 'edge';

export async function GET() {
  const size = 192;

  return new ImageResponse(<PwaIcon size={size} />, {
    width: size,
    height: size,
  });
}
