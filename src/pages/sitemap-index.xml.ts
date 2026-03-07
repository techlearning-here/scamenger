/**
 * Sitemap index for search engines. Served at /sitemap-index.xml
 */
import type { APIRoute } from 'astro';
import { getUsScamSlugs } from '../data/us-scams';

const SITE = 'https://scamenger.com';

const STATIC_PATHS = [
  '/',
  '/about/',
  '/news/',
  '/us/online-phone-scams/',
  '/us/financial-banking/',
  '/us/government-impersonation-tax/',
  '/us/corruption-fraud-waste/',
];

export const GET: APIRoute = () => {
  const slugs = getUsScamSlugs();
  const scamUrls = slugs.map((slug) => `${SITE}/us/scams/${slug}/`);
  const staticUrls = STATIC_PATHS.map((p) => (p === '/' ? SITE + '/' : SITE + p));
  const urls = [...staticUrls, ...scamUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${loc === SITE + '/' ? '1.0' : loc.includes('/us/scams/') ? '0.8' : '0.9'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
