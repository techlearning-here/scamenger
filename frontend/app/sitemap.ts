import type { MetadataRoute } from 'next';
import { getUsScamSlugs } from '@/data/us-scams';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

const STATIC_PATHS = [
  '/',
  '/about/',
  '/contact/',
  '/help-now/',
  '/report/',
  '/reports/',
  '/login/',
  '/auth/callback/',
  '/news/',
  '/us/online-phone-scams/',
  '/us/financial-banking/',
  '/us/government-impersonation-tax/',
  '/us/corruption-fraud-waste/',
];

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getUsScamSlugs();
  const scamUrls = slugs.map((slug) => ({
    url: `${siteUrl}/us/scams/${slug}/`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  const staticEntries = STATIC_PATHS.map((path) => ({
    url: path === '/' ? siteUrl : `${siteUrl}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1.0 : 0.9,
  }));
  return [...staticEntries, ...scamUrls];
}
