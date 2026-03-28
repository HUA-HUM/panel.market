import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lo Quiero ACA',
    short_name: 'LQA Panel',
    description: 'Marketplace operations console',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#07111f',
    theme_color: '#0ea5e9',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/512',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
