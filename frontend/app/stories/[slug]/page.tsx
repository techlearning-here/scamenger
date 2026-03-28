import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { notFound } from 'next/navigation';
import { SCAM_STORY_ENTRIES, getRelatedStories, getHardshipTag, HARDSHIP_TAG_LABELS } from '@/data/scam-stories';
import { getStoryContent } from '@/data/scam-stories-content';
import {
  STORY_ARTICLE_SCHEMA_DATE_ISO,
  enhanceStorySeoWithContent,
  getStorySeo,
} from '@/data/scam-stories-seo';
import { SCAM_CATEGORY_ICONS } from '@/data/scams/icons';
import { SCAM_CATEGORY_LABELS } from '@/data/scams/types';
import { AdUnitMid } from '@/components/AdUnitMid';
import { FlashCards } from '@/components/FlashCards';
import { buildStoryCards } from '@/lib/buildFlashCards';
import { StoryShareButtons } from './StoryShareButtons';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const storiesOgImage = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=630&q=80';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return SCAM_STORY_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = SCAM_STORY_ENTRIES.find((e) => e.slug === slug);
  if (!entry) return { title: 'Story not found' };
  const categoryLabel = SCAM_CATEGORY_LABELS[entry.category];
  const content = getStoryContent(slug);
  const seo = enhanceStorySeoWithContent(getStorySeo(entry.category, categoryLabel, entry.title), content);
  const url = `${siteUrl}/stories/${slug}/`;
  const tagList = [...seo.jsonLdKeywords, entry.slug.replace(/-/g, ' '), 'Scam Avenger'].slice(0, 12);
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    authors: [{ name: 'Scam Avenger', url: siteUrl }],
    creator: 'Scam Avenger',
    publisher: 'Scam Avenger',
    alternates: { canonical: url },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'article',
      title: seo.ogTitle,
      description: seo.ogDescription,
      url,
      siteName: 'Scam Avenger',
      locale: 'en_US',
      publishedTime: STORY_ARTICLE_SCHEMA_DATE_ISO,
      modifiedTime: STORY_ARTICLE_SCHEMA_DATE_ISO,
      images: [{ url: storiesOgImage, width: 1200, height: 630, alt: entry.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [storiesOgImage],
    },
    other: {
      'article:section': seo.articleSection,
      'article:tag': tagList.join(', '),
    },
  };
}

const RELATED_STORIES_COUNT = 4;

/** Renders text with **bold** segments as <strong>. */
function renderWithBold(text: string): React.ReactNode {
  const segments = text.split(/\*\*(.+?)\*\*/g);
  return segments.map((seg, i) => (i % 2 === 1 ? <strong key={i}>{seg}</strong> : seg));
}

/** Paragraph separator (Unicode U+2029). Split by string only so prod build matches local. */
const PARAGRAPH_SEP = '\u2029';

/** Splits section text into paragraphs and renders each as <p>. Uses string split only (no RegExp) so Vercel/minification doesn't alter behavior. */
function renderSectionParagraphs(text: string): React.ReactNode {
  const paragraphs = text
    .split(PARAGRAPH_SEP)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.map((para, i) => (
    <p key={i} className="story-page-section-body">
      {renderWithBold(para)}
    </p>
  ));
}

/**
 * Builds Article + BreadcrumbList JSON-LD for a story detail page.
 */
function buildStoryPageSchemaGraph(
  entry: { title: string; category: string },
  slug: string,
  seo: ReturnType<typeof getStorySeo>
) {
  const url = `${siteUrl}/stories/${slug}/`;
  const article = {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: entry.title,
    description: seo.metaDescription,
    url,
    articleSection: seo.articleSection,
    keywords: seo.jsonLdKeywords.join(', '),
    datePublished: STORY_ARTICLE_SCHEMA_DATE_ISO,
    dateModified: STORY_ARTICLE_SCHEMA_DATE_ISO,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Scam Avenger',
      url: siteUrl,
    },
    author: {
      '@type': 'Organization',
      name: 'Scam Avenger',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Scam Avenger',
      url: siteUrl,
    },
    image: {
      '@type': 'ImageObject',
      url: storiesOgImage,
      width: 1200,
      height: 630,
    },
  };
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Scam stories', item: `${siteUrl}/stories/` },
      { '@type': 'ListItem', position: 3, name: entry.title, item: url },
    ],
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [article, breadcrumb],
  };
}

export default async function StorySlugPage({ params }: Props) {
  const { slug } = await params;
  const entry = SCAM_STORY_ENTRIES.find((e) => e.slug === slug);
  if (!entry) notFound();

  const related = getRelatedStories(slug, entry.category, RELATED_STORIES_COUNT);
  const categoryLabel = SCAM_CATEGORY_LABELS[entry.category];
  const content = getStoryContent(slug);
  const seo = enhanceStorySeoWithContent(getStorySeo(entry.category, categoryLabel, entry.title), content);
  const storyUrl = `${siteUrl}/stories/${slug}/`;
  const pageSchemaJsonLd = buildStoryPageSchemaGraph(entry, slug, seo);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchemaJsonLd) }}
      />
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/stories/">Stories</Link>
        <span className="back-sep"> / </span>
        <span aria-current="page">{entry.title}</span>
      </nav>

      <article className="story-page">
        <span className="story-page-category">{categoryLabel}</span>
        <span className={`story-page-hardship story-page-hardship--${getHardshipTag(entry)}`}>
          {HARDSHIP_TAG_LABELS[getHardshipTag(entry)]}
        </span>
        <h1 className="story-page-title">{entry.title}</h1>
        <div className="story-page-share">
          <StoryShareButtons url={storyUrl} title={entry.title} />
        </div>
        {content ? (
          <div className="story-page-body">
            {renderSectionParagraphs(content.characterIntro)}
            {renderSectionParagraphs(content.initialPlot)}
            {renderSectionParagraphs(content.scamExperience)}
            {renderSectionParagraphs(content.victimExperience)}
            {renderSectionParagraphs(content.climax)}
            {renderSectionParagraphs(content.victimPain)}
            {renderSectionParagraphs(content.learningVictim)}
            <ul className="story-page-learning-list">
              {content.learningForReaders.map((item, i) => (
                <li key={i}>{renderWithBold(item)}</li>
              ))}
            </ul>
            <p className="story-page-section-body">
              For more help, see our <Link href="/report/">Report a scam</Link> page and <Link href="/spot-and-avoid-scams/">Spot and avoid scams</Link> guide.
            </p>
            <FlashCards cards={buildStoryCards(content)} />
          </div>
        ) : (
          <p className="story-page-coming">
            Full story content will be added here. Check back later or <Link href="/report/">report your own scam</Link>.
          </p>
        )}
        <p><Link href="/stories/">← All scam stories</Link></p>
      </article>

      <AdUnitMid />

      {related.length > 0 && (
        <aside className="story-related" aria-label="Related stories">
          <h2 className="story-related-title">Related stories</h2>
          <ul className="story-related-list" role="list">
            {related.map((r) => (
              <li key={r.slug} className="story-related-item">
                <Link
                  href={`/stories/${r.slug}`}
                  className={`story-related-card story-related-card--${r.category}`}
                >
                  <span className="story-related-meta">
                    <span className="story-related-icon" aria-hidden="true">
                      {SCAM_CATEGORY_ICONS[r.category]}
                    </span>
                    <span className="story-related-category">{SCAM_CATEGORY_LABELS[r.category]}</span>
                    <span className={`story-related-hardship story-related-hardship--${getHardshipTag(r)}`}>
                      {HARDSHIP_TAG_LABELS[getHardshipTag(r)]}
                    </span>
                  </span>
                  <span className="story-related-card-title">{r.title}</span>
                  <span className="story-related-arrow" aria-hidden="true">Read →</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </>
  );
}
