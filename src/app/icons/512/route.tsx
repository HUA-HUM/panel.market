import { ImageResponse } from 'next/og';
import { PwaIcon } from '@/src/app/pwa-icon';

export const runtime = 'edge';

export async function GET() {
  const size = 512;

  return new ImageResponse(<PwaIcon size={size} />, {
    width: size,
    height: size,
  });
}
