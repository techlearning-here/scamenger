import type { Metadata } from 'next';
import Link from 'next/link';
import { StoriesClient } from './StoriesClient';
import { StoriesQuote } from './StoriesQuote';
import { SCAM_STORY_ENTRIES } from '@/data/scam-stories';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const STORY_COUNT = SCAM_STORY_ENTRIES.length;
const CATEGORY_COUNT = new Set(SCAM_STORY_ENTRIES.map((e) => e.category)).size;
const storiesOgImage = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=630&q=80';

export const metadata: Metadata = {
  title: 'Scam stories – real experiences & lessons',
  description: 'Short, true scam and fraud stories: romance scams, investment fraud, phishing, job scams, and more. Learn from others and report your own experience.',
  keywords: 'scam stories, fraud stories, romance scam story, investment scam story, phishing story, job scam story, real scam experiences',
  alternates: {
    canonical: `${siteUrl}/stories/`,
    types: { 'application/rss+xml': `${siteUrl}/stories/feed` },
  },
  openGraph: {
    title: 'Scam stories – real experiences & lessons | Scam Avenger',
    description: 'Short, true scam and fraud stories. Learn from others and report your own experience.',
    url: `${siteUrl}/stories/`,
    images: [{ url: storiesOgImage, width: 1200, height: 630, alt: 'Scam stories – real experiences' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scam stories – real experiences & lessons | Scam Avenger',
    description: 'Short, true scam and fraud stories. Learn from others and report your own.',
    images: [storiesOgImage],
  },
};

const storiesIndexJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Scam stories – real experiences & lessons',
  description: 'Short, true scam and fraud stories: romance scams, investment fraud, phishing, job scams, and more. Learn from others and report your own experience.',
  url: `${siteUrl}/stories/`,
  numberOfItems: STORY_COUNT,
  isPartOf: {
    '@type': 'WebSite',
    name: 'Scam Avenger',
    url: siteUrl,
  },
};

export default function StoriesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storiesIndexJsonLd) }}
      />
      <header className="stories-hero">
        <img
          src={storiesOgImage}
          alt=""
          width={1200}
          height={280}
          className="stories-hero-img"
        />
        <div className="stories-hero-overlay">
          <h1 className="stories-hero-title">Scam stories</h1>
          <p className="stories-hero-tagline">Real experiences and lessons from people who were targeted.</p>
          <p className="stories-hero-count" aria-live="polite">
            {STORY_COUNT} stories across {CATEGORY_COUNT} categories
          </p>
        </div>
      </header>

      <div className="stories-intro-wrap">
        <StoriesQuote />
        <p className="stories-intro">
          Every story here is real—shared by people who were targeted, so others can learn and stay safer. 
          See how scams actually play out: the red flags they missed, what they wish they&apos;d known, and how they moved forward. 
          You&apos;re not alone, and what you read might be the nudge that stops you or someone you care about from falling for the same trick. 
          Browse by category or dive in—and if you&apos;ve been through it, consider reporting your experience so your story can help too.
        </p>
      </div>

      <div className="stories-why-read" role="region" aria-label="Why read these stories">
        <ul className="stories-why-read-list">
          <li>
            <span className="stories-why-read-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            </span>
            <span><Link href="/tools/">Protect yourself</Link>, learn from real red flags</span>
          </li>
          <li>
            <span className="stories-why-read-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </span>
            <span>See how others recovered</span>
          </li>
          <li>
            <span className="stories-why-read-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11 11v6"/><path d="M15 14v3"/></svg>
            </span>
            <span>Help others by <Link href="/report/">sharing your experience</Link></span>
          </li>
        </ul>
      </div>

      <p className="stories-jump-wrap">
        <a href="#stories-browse" className="stories-jump-link">
          Browse stories ↓
        </a>
      </p>

      <StoriesClient />
    </>
  );
}
