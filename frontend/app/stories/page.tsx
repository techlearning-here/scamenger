import type { Metadata } from 'next';
import { StoriesClient } from './StoriesClient';
import { SCAM_STORY_ENTRIES } from '@/data/scam-stories';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const STORY_COUNT = SCAM_STORY_ENTRIES.length;
const CATEGORY_COUNT = new Set(SCAM_STORY_ENTRIES.map((e) => e.category)).size;
const storiesOgImage = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=630&q=80';

export const metadata: Metadata = {
  title: 'Scam stories – real experiences & lessons',
  description: 'Short, true scam and fraud stories: romance scams, investment fraud, phishing, job scams, and more. Learn from others and report your own experience.',
  keywords: 'scam stories, fraud stories, romance scam story, investment scam story, phishing story, job scam story, real scam experiences',
  alternates: { canonical: `${siteUrl}/stories/` },
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

export default function StoriesPage() {
  return (
    <>
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
        <p className="stories-intro">
          Every story here is real—shared by people who were targeted, so others can learn and stay safer. 
          See how scams actually play out: the red flags they missed, what they wish they&apos;d known, and how they moved forward. 
          You&apos;re not alone, and what you read might be the nudge that stops you or someone you care about from falling for the same trick. 
          Browse by category or dive in—and if you&apos;ve been through it, consider reporting your experience so your story can help too.
        </p>
      </div>

      <StoriesClient />
    </>
  );
}
