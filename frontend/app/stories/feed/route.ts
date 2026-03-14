import { SCAM_STORY_ENTRIES } from '@/data/scam-stories';
import { SCAM_CATEGORY_LABELS } from '@/data/scams/types';

const SITE_URL = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const FEED_TITLE = 'Scam stories – Scam Avenger';
const FEED_DESCRIPTION = 'Real scam and fraud stories: romance, investment, phishing, job scams, and more. Learn from others and report your own experience.';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * RSS 2.0 feed for scam stories. Newest entries last in array appear first in feed.
 */
export async function GET() {
  const feedUrl = `${SITE_URL}/stories/feed`;
  const storiesUrl = `${SITE_URL}/stories/`;

  const items = [...SCAM_STORY_ENTRIES]
    .reverse()
    .slice(0, 50)
    .map((entry) => {
      const link = `${SITE_URL}/stories/${entry.slug}/`;
      const categoryLabel = SCAM_CATEGORY_LABELS[entry.category];
      const description = `Scam story: ${entry.title}. Category: ${categoryLabel}.`;
      return `  <item>
    <title>${escapeXml(entry.title)}</title>
    <link>${escapeXml(link)}</link>
    <description>${escapeXml(description)}</description>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
  </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${escapeXml(storiesUrl)}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
