import type { Metadata } from 'next';
import Link from 'next/link';
import { getNewsItems } from './getNews';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const newsOgImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&h=630&q=80';

export const metadata: Metadata = {
  title: 'Scam & fraud news',
  description: 'Latest scam, fraud, and consumer protection news from the FTC and trusted sources.',
  keywords: 'scam news, fraud news, FTC consumer protection, scam alerts, consumer fraud alerts',
  alternates: { canonical: `${siteUrl}/news/` },
  openGraph: {
    title: 'Scam & fraud news | Scam Avenger',
    description: 'Latest scam, fraud, and consumer protection news from the FTC and trusted sources.',
    url: `${siteUrl}/news/`,
    images: [{ url: newsOgImage, width: 1200, height: 630, alt: 'Scam & fraud news' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scam & fraud news | Scam Avenger',
    description: 'Latest scam, fraud, and consumer protection news from the FTC and trusted sources.',
    images: [newsOgImage],
  },
};

export default async function NewsPage() {
  const newsItems = await getNewsItems();

  return (
    <>
      <header className="news-hero">
        <img
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80"
          alt=""
          width={1200}
          height={280}
          className="news-hero-img"
        />
        <div className="news-hero-overlay">
          <h1 className="news-hero-title">Scam & fraud news</h1>
          <p className="news-hero-tagline">Latest consumer protection and scam alerts.</p>
        </div>
      </header>

      <p className="intro">Recent consumer protection and scam-related news. Use this to stay aware of current threats and enforcement actions.</p>

      {newsItems.length > 0 ? (
        <div className="news-container">
          <ul className="news-list">
            {newsItems.map((item) => {
              const desc = item.description?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
              return (
                <li key={item.link} className="news-item">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-title">{item.title}</a>
                  <span className="news-meta">
                    {item.source && <span className="news-source-tag">{item.source}</span>}
                  </span>
                  {desc ? <p className="news-desc">{desc}{desc.length >= 220 ? '…' : ''}</p> : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="news-container">
          <p className="news-fallback-text">News feed is temporarily unavailable. You can still get the latest scam alerts from these sources:</p>
          <ul>
            <li><a href="https://consumer.ftc.gov/consumer-alerts" target="_blank" rel="noopener noreferrer">FTC Consumer Alerts</a></li>
            <li><a href="https://www.ic3.gov/News" target="_blank" rel="noopener noreferrer">FBI IC3 News</a></li>
            <li><a href="https://www.consumerfinance.gov/about-us/newsroom/" target="_blank" rel="noopener noreferrer">CFPB Newsroom</a></li>
          </ul>
        </div>
      )}

      <p className="news-source">Feeds: <a href="https://www.ftc.gov/news-events/stay-connected/ftc-rss-feeds" target="_blank" rel="noopener noreferrer">FTC Press Releases</a>, <a href="https://www.consumer.ftc.gov/blog" target="_blank" rel="noopener noreferrer">FTC Consumer Blog</a>, <a href="https://www.ic3.gov/PSA" target="_blank" rel="noopener noreferrer">FBI IC3 News</a>, <a href="https://www.consumerfinance.gov/about-us/newsroom/" target="_blank" rel="noopener noreferrer">CFPB Newsroom</a>.</p>
    </>
  );
}
