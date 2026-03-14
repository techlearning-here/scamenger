import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SCAM_STORY_ENTRIES } from '@/data/scam-stories';
import { SCAM_CATEGORY_LABELS } from '@/data/scams/types';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return SCAM_STORY_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = SCAM_STORY_ENTRIES.find((e) => e.slug === slug);
  if (!entry) return { title: 'Story not found' };
  const categoryLabel = SCAM_CATEGORY_LABELS[entry.category];
  return {
    title: `${entry.title} – Scam story`,
    description: `Scam story: ${entry.title}. Category: ${categoryLabel}. Real experience, anonymized.`,
    alternates: { canonical: `${siteUrl}/stories/${slug}/` },
    openGraph: {
      title: `${entry.title} | Scam Avenger`,
      description: `Scam story: ${entry.title}. Category: ${categoryLabel}.`,
      url: `${siteUrl}/stories/${slug}/`,
    },
  };
}

export default async function StorySlugPage({ params }: Props) {
  const { slug } = await params;
  const entry = SCAM_STORY_ENTRIES.find((e) => e.slug === slug);
  if (!entry) notFound();

  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/stories/">Stories</Link>
        <span className="back-sep"> / </span>
        <span aria-current="page">{entry.title}</span>
      </nav>

      <article className="story-page">
        <span className="story-page-category">{SCAM_CATEGORY_LABELS[entry.category]}</span>
        <h1 className="story-page-title">{entry.title}</h1>
        <p className="story-page-coming">Story content will be added here. Check back later or <Link href="/report/">report your own scam</Link>.</p>
        <p><Link href="/stories/">← All scam stories</Link></p>
      </article>
    </>
  );
}
