import { describe, it, expect } from 'vitest';
import sitemap from './sitemap';
import { getUsScamSlugs } from '@/data/us-scams';

describe('sitemap', () => {
  it('returns an array of sitemap entries', () => {
    const result = sitemap();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes home and key static pages', () => {
    const result = sitemap();
    const urls = result.map((e) => e.url);
    const base = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
    expect(urls.some((u) => u === base || u === `${base}/`)).toBe(true);
    expect(urls.some((u) => u.includes('/report'))).toBe(true);
    expect(urls.some((u) => u.includes('/help-now'))).toBe(true);
    expect(urls.some((u) => u.includes('/lookup-report'))).toBe(true);
    expect(urls.some((u) => u.includes('/immediate-help'))).toBe(true);
    expect(urls.some((u) => u.includes('/emotional-support'))).toBe(true);
    expect(urls.some((u) => u.includes('/news'))).toBe(true);
    expect(urls.some((u) => u.includes('/about'))).toBe(true);
    expect(urls.some((u) => u.includes('/contact'))).toBe(true);
    expect(urls.some((u) => u.includes('/tools'))).toBe(true);
  });

  it('includes legal and policy pages', () => {
    const result = sitemap();
    const urls = result.map((e) => e.url);
    expect(urls.some((u) => u.includes('/privacy'))).toBe(true);
    expect(urls.some((u) => u.includes('/terms'))).toBe(true);
    expect(urls.some((u) => u.includes('/disclaimer'))).toBe(true);
    expect(urls.some((u) => u.includes('/content-guidelines'))).toBe(true);
    expect(urls.some((u) => u.includes('/notice-takedown'))).toBe(true);
  });

  it('includes US scam type pages for each slug from getUsScamSlugs', () => {
    const slugs = getUsScamSlugs();
    const result = sitemap();
    const urls = result.map((e) => e.url);
    const base = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
    for (const slug of slugs) {
      expect(urls).toContain(`${base}/us/scams/${slug}/`);
    }
  });

  it('each entry has url, lastModified, changeFrequency, and priority', () => {
    const result = sitemap();
    for (const entry of result) {
      expect(entry).toHaveProperty('url');
      expect(typeof entry.url).toBe('string');
      expect(entry.url.length).toBeGreaterThan(0);
      expect(entry).toHaveProperty('lastModified');
      expect(entry).toHaveProperty('changeFrequency');
      expect(['weekly', 'monthly']).toContain(entry.changeFrequency);
      expect(entry).toHaveProperty('priority');
      expect(typeof entry.priority).toBe('number');
    }
  });
});
