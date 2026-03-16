import type { Metadata } from 'next';
import Link from 'next/link';
import { getUsScamTypes, SCAM_CATEGORY_LABELS } from '@/data/us-scams';
import type { ScamCategoryId } from '@/data/scams/types';
import { ScamCard } from '@/components/ScamCard';
import { FindYourPathCarousel } from '@/components/FindYourPathCarousel';
import type { FindYourPathSlide } from '@/components/FindYourPathCarousel';
import { CountryTopicsClient } from './CountryTopicsClient';
import { NewsletterCtaButton } from './NewsletterCtaButton';

/** Find your path carousel slides (persona-based entry). */
const FIND_YOUR_PATH_SLIDES: FindYourPathSlide[] = [
  {
    id: 'learn',
    icon: '📚',
    title: 'I want to learn about scams',
    desc: 'Read real stories and guides to spot red flags and avoid common traps.',
    links: [
      { label: 'Browse stories', href: '/stories/' },
      { label: 'See popular guides', href: '#popular-guides-heading' },
    ],
  },
  {
    id: 'was-scammed',
    icon: '⚡',
    title: 'I was scammed — I need to take action',
    desc: 'Get your 0–24 hour checklist, report the scam, and find emotional support.',
    links: [
      { label: 'Immediate response checklist', href: '/immediate-help/' },
      { label: 'Report a scam', href: '/report/' },
      { label: 'Emotional support', href: '/emotional-support/' },
    ],
  },
  {
    id: 'protect',
    icon: '🛡️',
    title: 'I want to protect myself & my devices',
    desc: 'Step-by-step tips for your phone, laptop, bank account, and more.',
    links: [{ label: 'Tools & protect guides', href: '/tools/' }],
  },
  {
    id: 'help-now',
    icon: '🆘',
    title: 'I need help right now',
    desc: 'Official reporting and support links by country.',
    links: [
      { label: 'Need help now?', href: '/help-now/' },
      { label: 'Immediate response', href: '/immediate-help/' },
    ],
  },
  {
    id: 'warn-others',
    icon: '📢',
    title: 'I want to warn others',
    desc: 'Report a scam and get a shareable link so others can avoid it.',
    links: [
      { label: 'Report a scam', href: '/report/' },
      { label: 'Get alerts', href: '/newsletter/' },
    ],
  },
  {
    id: 'stay-updated',
    icon: '📬',
    title: 'I want to stay updated',
    desc: 'Get scam alerts and new guides in your inbox, or read the latest news.',
    links: [
      { label: 'Subscribe to newsletter', href: '/newsletter/' },
      { label: 'News', href: '/news/' },
    ],
  },
];

const categoryOrder: ScamCategoryId[] = [
  'online', 'phone', 'financial', 'impersonation', 'employment', 'housing',
  'prizes_charity', 'identity_benefits', 'government', 'emerging',
];
const orderMap = Object.fromEntries(categoryOrder.map((c, i) => [c, i]));

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const heroImagePhoto = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&h=400&auto=format&fit=crop&ixlib=rb-4.1.0';

export const metadata: Metadata = {
  title: 'Scam & Fraud Awareness | Scam Avenger',
  description: 'Learn about scams and fraud. Free guides, awareness resources, and official links by country and scam type. Build awareness and get support — no sign-up required.',
  alternates: { canonical: `${siteUrl}/` },
  openGraph: {
    title: 'Scam & Fraud Awareness | Scam Avenger',
    description: 'Learn about scams and fraud. Free guides and awareness resources. No sign-up required.',
    url: `${siteUrl}/`,
    images: [{ url: heroImagePhoto, width: 1200, height: 400, alt: 'Scam and fraud awareness – Scam Avenger' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scam & Fraud Awareness | Scam Avenger',
    description: 'Learn about scams and fraud. Free guides and awareness resources.',
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
          <h1 className="hero-tagline">
            <span className="hero-tagline-main">Scam & fraud awareness — learn, protect, warn others</span>
            <span className="hero-tagline-sub">
              <Link href="/stories/" className="hero-tagline-link">Real stories</Link>
              {' '}from people who were targeted. Learn from red flags, see how others recovered,{' '}
              <Link href="/tools/" className="hero-tagline-link">protect yourself</Link>
              , and help others by{' '}
              <Link href="/report/" className="hero-tagline-link">sharing your experience</Link>.
            </span>
          </h1>
        </div>
      </header>

      <section className="trust-indicators" aria-label="Trust and privacy">
        <div className="trust-indicators-inner">
          <div className="trust-indicators-item">
            <span className="trust-indicators-icon" aria-hidden="true">🎭</span>
            <div className="trust-indicators-content">
              <strong>Share scams and fraud anonymously</strong>
              <span className="trust-indicators-desc">Your identity stays private when you share</span>
            </div>
          </div>
          <div className="trust-indicators-item">
            <span className="trust-indicators-icon" aria-hidden="true">🛡️</span>
            <div className="trust-indicators-content">
              <strong>100% free</strong>
              <span className="trust-indicators-desc">No cost to learn, share, or browse</span>
            </div>
          </div>
          <div className="trust-indicators-item">
            <span className="trust-indicators-icon" aria-hidden="true">🔒</span>
            <div className="trust-indicators-content">
              <strong>No sign-up required</strong>
              <span className="trust-indicators-desc">Share what you&apos;ve seen without an account</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-block" aria-label="Our mission">
        <p className="mission-text">
          <strong>You&apos;re not alone.</strong> Every day, <strong>over 1.6 million people</strong> fall victim to scams and fraud worldwide. Scam Avenger helps you <strong>learn and build awareness</strong> about scams and fraud—so you can spot and avoid them. We also help you figure out what happened, get guided to the right place to report if you choose to, and find support to recover. We&apos;re community-driven: share what you&apos;ve seen, check if others saw the same thing, and use our free guides and official links by country and scam type to take action and help others avoid the same traps.
        </p>
        <p className="mission-regions" role="note">
          Official links and support for many countries. Choose your country on <Link href="/help-now/">Need help now?</Link> or when <Link href="/report/">sharing a scam</Link>. In the first 0–24 hours? Use our <Link href="/immediate-help/">Immediate response checklist and evidence collection list</Link>.
        </p>
      </section>

      <section id="find-your-path" className="find-your-path" aria-labelledby="find-your-path-heading">
        <h2 id="find-your-path-heading" className="find-your-path-heading">Find your path</h2>
        <p className="find-your-path-intro">New here? Choose what you need — we&apos;ll take you to the right place.</p>
        <FindYourPathCarousel slides={FIND_YOUR_PATH_SLIDES} />
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
        <h2 id="popular-guides-heading">Popular scam &amp; fraud guides</h2>
        <p className="popular-guides-intro">Learn about common scams and where to get help. Guides below are for the <strong>USA</strong>; use <Link href="/help-now/">Need help now?</Link> for official links in other supported regions.</p>
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

      <section className="newsletter_cta_block" aria-labelledby="newsletter-cta-heading">
        <h2 id="newsletter-cta-heading" className="newsletter_cta_heading">Get scam alerts and new guides</h2>
        <p className="newsletter_cta_text">Stay updated with practical tips and new guides. No spam; unsubscribe anytime.</p>
        <NewsletterCtaButton />
      </section>

      <CountryTopicsClient usScamTopics={usScamTopics} />
    </>
  );
}
