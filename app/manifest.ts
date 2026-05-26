import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             'MoneyFlow',
    short_name:       'MoneyFlow',
    description:      'Gestionează-ți finanțele personal',
    start_url:        '/',
    display:          'standalone',
    background_color: '#F8FAFC',
    theme_color:      '#1A3C5E',
    orientation:      'portrait',
    icons: [
      { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'maskable' },
      { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
