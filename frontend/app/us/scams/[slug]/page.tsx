import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getUsScamBySlug, getUsScamTypes, SCAM_CATEGORY_LABELS } from '@/data/us-scams';
import { getPrevalenceBadge, PREVALENCE_BADGE_LABELS } from '@/data/scams/icons';
import { AdUnitMid } from '@/components/AdUnitMid';
import { CategoryIntro } from '@/components/CategoryIntro';
import { ProgressSteps } from '@/components/ProgressSteps';
import { ReportCard } from '@/components/ReportCard';
import { FlashCards } from '@/components/FlashCards';
import { buildScamCards } from '@/lib/buildFlashCards';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const defaultScamOgImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&h=630&auto=format&fit=crop';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getUsScamTypes().map((scam) => ({ slug: scam.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scam = getUsScamBySlug(slug);
  if (!scam) return { title: 'Scam not found' };
  const metaDesc = scam.intro.length > 155 ? scam.intro.slice(0, 152).trim() + '...' : scam.intro;
  const categoryLabel = SCAM_CATEGORY_LABELS[scam.category];
  const pageKeywords = `report ${scam.name}, ${scam.name} fraud, where to report ${scam.name}, report fraud USA, FTC report, IC3, ${categoryLabel}`;
  const title = `How to Report ${scam.name} in the USA | Scam Avenger`;
  return {
    title: title,
    description: `How to report ${scam.name} in the USA. ${metaDesc}`,
    keywords: pageKeywords,
    alternates: { canonical: `${siteUrl}/us/scams/${scam.slug}/` },
    openGraph: {
      type: 'article',
      title,
      description: metaDesc,
      url: `${siteUrl}/us/scams/${scam.slug}/`,
      images: [{ url: defaultScamOgImage, width: 1200, height: 630, alt: title }],
      siteName: 'Scam Avenger',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDesc,
      images: [defaultScamOgImage],
    },
  };
}

export default async function ScamSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const scam = getUsScamBySlug(slug);
  if (!scam) {
    return (
      <div>
        <p>Scam type not found.</p>
        <Link href="/">← Back to Home</Link>
      </div>
    );
  }

  const metaDesc = scam.intro.length > 155 ? scam.intro.slice(0, 152).trim() + '...' : scam.intro;
  const categoryLabel = SCAM_CATEGORY_LABELS[scam.category];
  const relatedScams = (scam.relatedSlugs ?? [])
    .map((s) => getUsScamBySlug(s))
    .filter((s): s is NonNullable<typeof s> => s != null);
  const prevalenceBadge = getPrevalenceBadge(scam.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `How to report ${scam.name} in the USA`,
    description: metaDesc,
    url: `${siteUrl}/us/scams/${scam.slug}/`,
    image: defaultScamOgImage,
    publisher: { '@type': 'Organization', name: 'Scam Avenger', url: siteUrl },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="back"><Link href="/">← Back to Home</Link></p>
      <p className="category-label">Category: {categoryLabel}</p>
      <div className="scam-title-row">
        <h1>{scam.name}</h1>
        {prevalenceBadge && (
          <span className={`scam-prevalence-badge scam-prevalence-badge--${prevalenceBadge}`}>
            {prevalenceBadge ? PREVALENCE_BADGE_LABELS[prevalenceBadge] : null}
          </span>
        )}
      </div>

      <ProgressSteps />

      {scam.warning ? (
        <section className="warning-section" aria-labelledby="warning-heading">
          <h2 id="warning-heading" className="visually-hidden">Important</h2>
          <p className="warning-text">{scam.warning}</p>
        </section>
      ) : null}

      <section className="story-section" aria-labelledby="story-heading">
        <h2 id="story-heading">How it often plays out</h2>
        <p className="story">{scam.story}</p>
      </section>

      {(scam.statistics?.length ?? 0) > 0 ? (
        <section className="statistics-section" aria-labelledby="statistics-heading">
          <h2 id="statistics-heading">By the numbers</h2>
          <ul>
            {scam.statistics!.map((stat, i) => (
              <li key={i}>{stat}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(scam.spotIt?.length ?? 0) > 0 ? (
        <section className="spot-section" aria-labelledby="spot-heading">
          <h2 id="spot-heading">How to spot it</h2>
          <ul>
            {scam.spotIt!.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="spot-section" aria-labelledby="spot-heading">
          <h2 id="spot-heading">How to spot it</h2>
          <p className="spot-generic">Common red flags: pressure to act immediately, requests for payment by gift card or wire, offers that seem too good to be true, or unsolicited requests for your personal or financial details.</p>
        </section>
      )}

      {((scam.dos?.length ?? 0) > 0 || (scam.donts?.length ?? 0) > 0) ? (
        <section className="dos-donts" aria-labelledby="dos-donts-heading">
          <h2 id="dos-donts-heading">Do&apos;s and don&apos;ts</h2>
          <div className="dos-donts-grid">
            {(scam.dos?.length ?? 0) > 0 ? (
              <div className="dos-list">
                <h3>Do</h3>
                <ul>
                  {scam.dos!.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {(scam.donts?.length ?? 0) > 0 ? (
              <div className="donts-list">
                <h3>Don&apos;t</h3>
                <ul>
                  {scam.donts!.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <AdUnitMid />

      <CategoryIntro intro={scam.intro} steps={scam.steps} />

      <h2>Where to report</h2>

      {scam.reports.map((r, i) => (
        <ReportCard
          key={i}
          who={r.who}
          when={r.when}
          prepare={r.prepare}
          href={r.href}
          label={r.label}
          estimatedTime={r.estimatedTime}
        />
      ))}

      {relatedScams.length > 0 ? (
        <section className="related-section" aria-labelledby="related-heading">
          <h2 id="related-heading">Related scams</h2>
          <ul className="related-list">
            {relatedScams.map((related) => (
              <li key={related.slug}><Link href={`/us/scams/${related.slug}/`}>{related.name}</Link></li>
            ))}
          </ul>
        </section>
      ) : null}

      {(scam.faq?.length ?? 0) > 0 ? (
        <section className="faq-section" aria-labelledby="faq-heading">
          <h2 id="faq-heading">Frequently asked questions</h2>
          <dl className="faq-list">
            {scam.faq!.map((item, i) => (
              <React.Fragment key={i}>
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </React.Fragment>
            ))}
          </dl>
        </section>
      ) : null}

      {(scam.learnMore?.length ?? 0) > 0 ? (
        <section className="learn-more-section" aria-labelledby="learn-more-heading">
          <h2 id="learn-more-heading">Learn more</h2>
          <ul className="learn-more-list">
            {scam.learnMore!.map((link, i) => (
              <li key={i}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a></li>
            ))}
          </ul>
        </section>
      ) : null}

      <FlashCards cards={buildScamCards(scam)} />

      <p className="scam-recommended-reading">
        Build your knowledge: <Link href="/tools/books/">Recommended reading — books &amp; free websites on financial literacy and fraud awareness</Link>
      </p>
    </>
  );
}
