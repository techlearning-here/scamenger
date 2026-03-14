import type { Metadata } from 'next';
import Link from 'next/link';
import { NewsletterSignup } from '@/components/NewsletterSignup';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Newsletter – scam alerts and guides',
  description: 'Subscribe to get scam alerts, new guides, and tips to protect yourself. No spam; unsubscribe anytime.',
  alternates: { canonical: `${siteUrl}/newsletter/` },
};

export default function NewsletterPage() {
  return (
    <article className="newsletter_page">
      <header className="newsletter_page_header">
        <div className="newsletter_page_icon" aria-hidden="true">
          ✉️
        </div>
        <h1 className="newsletter_page_title">Stay ahead of scams</h1>
        <p className="newsletter_page_intro">
          Get scam alerts and new guides in your inbox. Short, practical tips to spot fraud and protect yourself—no spam, unsubscribe anytime.
        </p>
        <ul className="newsletter_page_trust" aria-label="Why subscribe">
          <li>No spam, ever</li>
          <li>Unsubscribe in one click</li>
          <li>Practical tips only</li>
        </ul>
      </header>
      <div className="newsletter_page_card">
        <NewsletterSignup variant="page" />
      </div>
      <p className="newsletter_page_back">
        <Link href="/" className="newsletter_page_back_link">← Back to home</Link>
      </p>
    </article>
  );
}
