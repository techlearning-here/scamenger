import type { MetadataRoute } from 'next';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/z7k2m9/', '/auth/', '/login/'] },
      { userAgent: 'Googlebot', allow: '/', disallow: ['/z7k2m9/', '/auth/', '/login/'] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
