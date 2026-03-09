import type { Metadata } from 'next';
import Link from 'next/link';
import { getUsScamTypes, SCAM_CATEGORY_LABELS } from '@/data/us-scams';
import type { ScamCategoryId } from '@/data/scams/types';
import { ScamCard } from '@/components/ScamCard';
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
      slug: s.slug,
      categoryId: s.category,
    }));
}

const popularSlugs = ['phishing', 'romance', 'irs-tax-impersonation', 'identity-theft', 'job-employment', 'robocalls-phone', 'bank-zelle-transfer', 'fake-shopping'];

/** Hardcoded stats for top scam types (illustrative; e.g. FTC/IC3-style aggregates). */
const TOP_SCAM_STATS: { slug: string; value: string; valueLabel: string }[] = [
  { slug: 'phishing', value: '2.6M', valueLabel: 'FTC reports' },
  { slug: 'romance', value: '64K', valueLabel: 'reports' },
  { slug: 'irs-tax-impersonation', value: '1.1M', valueLabel: 'IRS impersonation reports' },
  { slug: 'identity-theft', value: '1.1M', valueLabel: 'FTC reports' },
  { slug: 'job-employment', value: '100K+', valueLabel: 'reports' },
  { slug: 'robocalls-phone', value: '180K+', valueLabel: 'FTC complaints' },
  { slug: 'bank-zelle-transfer', value: '90K+', valueLabel: 'Zelle fraud reports' },
  { slug: 'fake-shopping', value: '150K+', valueLabel: 'reports' },
];

export default function HomePage() {
  const usScamTopics = getOrderedTopics();
  const popularGuides = getUsScamTypes().filter((s) => popularSlugs.includes(s.slug));
  const scamByName = Object.fromEntries(getUsScamTypes().map((s) => [s.slug, s]));

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
          <h1 className="hero-tagline">You're not alone. Let's get you to the right help.<br />Report a scam, find official channels, and protect others.</h1>
        </div>
      </header>

      <section className="trust-indicators" aria-label="Trust and privacy">
        <span className="trust-indicators-item">
          <span className="trust-indicators-icon" aria-hidden="true">🛡️</span>
          <strong>100% free</strong> — no cost to report or browse
        </span>
        <span className="trust-indicators-item">
          <span className="trust-indicators-icon" aria-hidden="true">🔒</span>
          <strong>No sign-up required</strong> — submit a report without an account
        </span>
      </section>

      <section className="mission-block" aria-label="Our mission">
        <p className="mission-text">
          <strong>You&apos;re not alone.</strong> We help people who&apos;ve been targeted by scams find the right place to report and get support. Our community-based guides point you to official channels (FTC, IC3, CFPB, and more) so you can take action—and help others avoid the same traps.
        </p>
      </section>

      <section className="top-scam-stats" aria-labelledby="top-scam-stats-heading">
        <h2 id="top-scam-stats-heading" className="top-scam-stats-heading">Top scams at a glance</h2>
        <p className="top-scam-stats-intro">Reported scale of common scam types (U.S. sources; approx.):</p>
        <ul className="top-scam-stats-list">
          {TOP_SCAM_STATS.map((item) => {
            const scam = scamByName[item.slug];
            const name = scam?.name ?? item.slug;
            return (
              <li key={item.slug} className="top-scam-stats-card">
                <Link href={scam ? `/us/scams/${scam.slug}/` : '#'} className="top-scam-stats-card-link">
                  <span className="top-scam-stats-card-value">{item.value}</span>
                  <span className="top-scam-stats-card-label">{item.valueLabel}</span>
                  <span className="top-scam-stats-card-name">{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="popular-guides" aria-labelledby="popular-guides-heading">
        <h2 id="popular-guides-heading">Popular reporting guides</h2>
        <p className="popular-guides-intro">Quick links to where to report common scams in the USA:</p>
        <ul className="scam-cards-grid popular-guides-list">
          {popularGuides.map((scam) => (
            <ScamCard
              key={scam.slug}
              slug={scam.slug}
              name={scam.name}
              category={scam.category}
            />
          ))}
        </ul>
      </section>

      <CountryTopicsClient usScamTopics={usScamTopics} />
    </>
  );
}
