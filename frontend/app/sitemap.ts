import type { MetadataRoute } from 'next';
import { BOOKS_LIST_LAST_UPDATED } from '@/data/books';
import { SCAM_STORY_ENTRIES } from '@/data/scam-stories';
import { getUsScamSlugs } from '@/data/us-scams';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

/** Paths with a known content last-modified date (ISO date string). Used for accurate lastmod in sitemap. */
const PATH_LAST_MODIFIED: Record<string, string> = {
  '/tools/books/': BOOKS_LIST_LAST_UPDATED,
};

const STATIC_PATHS: { path: string; priority: number; changeFreq: 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1.0, changeFreq: 'weekly' },
  { path: '/report/', priority: 0.95, changeFreq: 'weekly' },
  { path: '/lookup-report/', priority: 0.9, changeFreq: 'weekly' },
  { path: '/help-now/', priority: 0.95, changeFreq: 'weekly' },
  { path: '/immediate-help/', priority: 0.9, changeFreq: 'monthly' },
  { path: '/emotional-support/', priority: 0.9, changeFreq: 'monthly' },
  { path: '/spot-and-avoid-scams/', priority: 0.85, changeFreq: 'monthly' },
  { path: '/tools/', priority: 0.9, changeFreq: 'monthly' },
  { path: '/tools/protect-phone/', priority: 0.85, changeFreq: 'monthly' },
  { path: '/tools/protect-laptop/', priority: 0.85, changeFreq: 'monthly' },
  { path: '/tools/protect-bank-account/', priority: 0.85, changeFreq: 'monthly' },
  { path: '/tools/protect-credit-card/', priority: 0.85, changeFreq: 'monthly' },
  { path: '/tools/books/', priority: 0.8, changeFreq: 'monthly' },
  { path: '/stories/', priority: 0.9, changeFreq: 'weekly' },
  { path: '/about/', priority: 0.85, changeFreq: 'monthly' },
  { path: '/contact/', priority: 0.85, changeFreq: 'monthly' },
  { path: '/newsletter/', priority: 0.85, changeFreq: 'monthly' },
  { path: '/news/', priority: 0.9, changeFreq: 'weekly' },
  { path: '/reports/', priority: 0.8, changeFreq: 'weekly' },
  { path: '/privacy/', priority: 0.5, changeFreq: 'monthly' },
  { path: '/terms/', priority: 0.5, changeFreq: 'monthly' },
  { path: '/disclaimer/', priority: 0.5, changeFreq: 'monthly' },
  { path: '/content-guidelines/', priority: 0.5, changeFreq: 'monthly' },
  { path: '/notice-takedown/', priority: 0.5, changeFreq: 'monthly' },
  { path: '/us/online-phone-scams/', priority: 0.8, changeFreq: 'weekly' },
  { path: '/us/financial-banking/', priority: 0.8, changeFreq: 'weekly' },
  { path: '/us/government-impersonation-tax/', priority: 0.8, changeFreq: 'weekly' },
  { path: '/us/corruption-fraud-waste/', priority: 0.8, changeFreq: 'weekly' },
  { path: '/site-map/', priority: 0.5, changeFreq: 'monthly' },
];

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getUsScamSlugs();
  const now = new Date();
  const scamUrls = slugs.map((slug) => ({
    url: `${siteUrl}/us/scams/${slug}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  const storyUrls = SCAM_STORY_ENTRIES.map((entry) => ({
    url: `${siteUrl}/stories/${entry.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));
  const staticEntries = STATIC_PATHS.map(({ path, priority, changeFreq }) => {
    const lastMod = PATH_LAST_MODIFIED[path] ? new Date(PATH_LAST_MODIFIED[path]) : now;
    const url = path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`;
    return {
      url,
      lastModified: lastMod,
      changeFrequency: changeFreq,
      priority,
    };
  });
  return [...staticEntries, ...scamUrls, ...storyUrls];
}
