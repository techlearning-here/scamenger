const API = 'https://api.rss2json.com/v1/api.json';
const MAX_ITEMS = 45;

const NEWS_FEEDS: Array<{ url: string; sourceName: string }> = [
  { url: 'https://www.ftc.gov/feeds/press-release-consumer-protection.xml', sourceName: 'FTC' },
  { url: 'https://www.ftc.gov/feeds/press-release.xml', sourceName: 'FTC' },
  { url: 'https://www.consumer.ftc.gov/blog/gd-rss.xml', sourceName: 'FTC Consumer' },
  { url: 'https://www.ic3.gov/rss/news.xml', sourceName: 'FBI IC3' },
  { url: 'https://www.consumerfinance.gov/about-us/newsroom/feed/', sourceName: 'CFPB' },
];

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  source?: string;
}

async function fetchFeed(feed: { url: string; sourceName: string }): Promise<NewsItem[]> {
  try {
    const apiUrl = `${API}?rss_url=${encodeURIComponent(feed.url)}`;
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(15000) });
    const data = await res.json();
    if (data?.status !== 'ok' || !Array.isArray(data.items)) return [];
    return data.items.map((item: { title?: string; link?: string; pubDate?: string; description?: string }) => ({
      title: item.title || 'Untitled',
      link: item.link || '#',
      pubDate: item.pubDate || '',
      description: item.description || '',
      source: feed.sourceName,
    }));
  } catch {
    return [];
  }
}

export async function getNewsItems(): Promise<NewsItem[]> {
  try {
    const results = await Promise.all(NEWS_FEEDS.map((f) => fetchFeed(f)));
    const merged = results.flat();
    const seen = new Set<string>();
    const deduped = merged.filter((item) => {
      const key = (item.link?.toLowerCase() || item.title) ?? '';
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    deduped.sort((a, b) => {
      const tA = new Date(a.pubDate).getTime();
      const tB = new Date(b.pubDate).getTime();
      return Number.isNaN(tB) ? -1 : Number.isNaN(tA) ? 1 : tB - tA;
    });
    return deduped.slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}
