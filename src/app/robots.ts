import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/_next/', '/api/', '/admin/'],
      },
    ],
    sitemap: 'https://buscacentral.com.br/sitemap.xml',
  };
}
