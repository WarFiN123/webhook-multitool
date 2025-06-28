import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Webhook Multi-Tool',
    short_name: 'Webhook',
    description: 'Download the Webhook Multi-Tool app to manage Discord webhooks easily.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}