import type { Metadata } from 'next';
import Link from 'next/link';
import { getUsScamTypes, SCAM_CATEGORY_LABELS } from '@/data/us-scams';
import type { ScamCategoryId } from '@/data/scams/types';
import { CountryTopicsClient } from './CountryTopicsClient';

const categoryOrder: ScamCategoryId[] = [
  'online', 'phone', 'financial', 'impersonation', 'employment', 'housing',
  'prizes_charity', 'identity_benefits', 'government', 'emerging',
];
const orderMap = Object.fromEntries(categoryOrder.map((c, i) => [c, i]));

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const heroImagePhoto = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&h=400&auto=format&fit=crop&ixlib=rb-4.1.0';

export const metadata: Metadata = {
  title: 'Scam Avenger',
  description: 'Find where to report scams, fraud, and corruption. Official reporting channels: FTC, IC3, CFPB. Report consumer fraud, identity theft, and internet crime in the USA.',
  alternates: { canonical: `${siteUrl}/` },
  openGraph: {
    title: 'Scam Avenger – Where to Report Scams, Fraud & Corruption',
    description: 'Find where to report scams, fraud, and corruption. Official reporting channels: FTC, IC3, CFPB.',
    url: `${siteUrl}/`,
    images: [{ url: heroImagePhoto, width: 1200, height: 400, alt: 'Scam Avenger' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scam Avenger – Where to Report Scams, Fraud & Corruption',
    description: 'Find where to report scams, fraud, and corruption. Official reporting channels: FTC, IC3, CFPB.',
    images: [heroImagePhoto],
  },
};

function getOrderedTopics() {
  return getUsScamTypes()
    .sort((a, b) => (orderMap[a.category] ?? 99) - (orderMap[b.category] ?? 99))
    .map((s) => ({
      name: s.name,
      path: `/us/scams/${s.slug}/`,
      category: SCAM_CATEGORY_LABELS[s.category],
    }));
}

const popularSlugs = ['phishing', 'romance', 'irs-tax-impersonation', 'identity-theft', 'job-employment', 'robocalls-phone', 'bank-zelle-transfer', 'fake-shopping'];

export default function HomePage() {
  const usScamTopics = getOrderedTopics();
  const popularGuides = getUsScamTypes().filter((s) => popularSlugs.includes(s.slug));

  return (
    <>
      <header className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImagePhoto}
          alt=""
          width={1200}
          height={400}
          className="hero-img"
          fetchPriority="high"
          loading="eager"
        />
        <div className="hero-overlay">
          <h1 className="hero-title">Scam Avenger</h1>
          <p className="hero-tagline">Report scams the right way—we connect you to the official channels that can help.</p>
        </div>
      </header>

      <p className="intro-p">Select a country below to see scam types and where to report each one.</p>

      <section className="popular-guides" aria-labelledby="popular-guides-heading">
        <h2 id="popular-guides-heading">Popular reporting guides</h2>
        <p className="popular-guides-intro">Quick links to where to report common scams in the USA:</p>
        <ul className="popular-guides-list">
          {popularGuides.map((scam) => (
            <li key={scam.slug} className="popular-guides-item">
              <Link href={`/us/scams/${scam.slug}/`} className="popular-guides-link">{scam.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <CountryTopicsClient usScamTopics={usScamTopics} />
    </>
  );
}
