/**
 * Theme-based SEO helpers for scam story pages.
 * Used by /stories/[slug] for meta tags, Open Graph, and JSON-LD.
 */

import type { ScamCategoryId } from '@/data/scams/types';

const META_DESC_MAX_LENGTH = 158;

/** SEO keywords and theme phrases per category for long-tail search and meta keywords. */
export const STORY_CATEGORY_SEO: Record<
  ScamCategoryId,
  { keywords: string[]; themePhrase: string }
> = {
  online: {
    keywords: ['online scam story', 'phishing story', 'scam experience', 'fake website', 'internet fraud'],
    themePhrase: 'Learn from this online scam experience.',
  },
  phone: {
    keywords: ['phone scam story', 'vishing', 'tech support scam', 'grandparent scam', 'real scam experience'],
    themePhrase: 'Real phone or tech support scam story.',
  },
  financial: {
    keywords: ['investment scam story', 'romance scam money', 'crypto scam', 'banking fraud', 'financial loss'],
    themePhrase: 'Financial scam story—learn the red flags.',
  },
  impersonation: {
    keywords: ['romance scam story', 'dating scam', 'catfish story', 'impersonation scam', 'real experience'],
    themePhrase: 'Romance or impersonation scam—what happened.',
  },
  employment: {
    keywords: ['job scam story', 'fake job offer', 'work from home scam', 'employment fraud', 'recruitment scam'],
    themePhrase: 'Job or employment scam experience.',
  },
  housing: {
    keywords: ['rental scam story', 'housing scam', 'fake listing', 'rental fraud', 'property scam'],
    themePhrase: 'Rental or housing scam story.',
  },
  prizes_charity: {
    keywords: ['lottery scam story', 'prize scam', 'charity scam', 'inheritance scam', 'sweepstakes scam'],
    themePhrase: 'Prize, lottery, or charity scam story.',
  },
  identity_benefits: {
    keywords: ['identity theft story', 'benefits scam', 'SSN scam', 'identity fraud', 'real experience'],
    themePhrase: 'Identity or benefits scam experience.',
  },
  government: {
    keywords: ['IRS scam story', 'government impersonation', 'tax scam', 'HMRC scam', 'official impersonation'],
    themePhrase: 'Government or tax impersonation scam story.',
  },
  emerging: {
    keywords: ['AI scam story', 'deepfake scam', 'QR code scam', 'new scam', 'emerging fraud'],
    themePhrase: 'Emerging scam—AI, deepfake, or new tactics.',
  },
  other: {
    keywords: ['scam story', 'fraud experience', 'real story', 'recovery', 'learn from scam'],
    themePhrase: 'Real scam story and lessons learned.',
  },
};

export interface StorySeoResult {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  themePhrase: string;
  articleSection: string;
  jsonLdKeywords: string[];
}

/**
 * Builds theme-based SEO values for a story page.
 */
export function getStorySeo(
  category: ScamCategoryId,
  categoryLabel: string,
  title: string
): StorySeoResult {
  const theme = STORY_CATEGORY_SEO[category];
  const themePhrase = theme.themePhrase;
  const keywords = theme.keywords;
  const titleShort = title.length > 60 ? `${title.slice(0, 57)}…` : title;
  const metaTitle = `${titleShort} | ${categoryLabel} scam story`;
  const ogTitle = `${titleShort} | Scam Avenger`;
  const baseDesc = `${titleShort}. ${themePhrase} Real experience, anonymized.`;
  const metaDescription =
    baseDesc.length > META_DESC_MAX_LENGTH
      ? `${baseDesc.slice(0, META_DESC_MAX_LENGTH - 3)}…`
      : baseDesc;
  const ogDescription =
    metaDescription.length > 200
      ? `${metaDescription.slice(0, 197)}…`
      : metaDescription;

  return {
    metaTitle,
    metaDescription,
    keywords: [...keywords, categoryLabel.toLowerCase(), 'scam story', 'real experience'].join(', '),
    ogTitle,
    ogDescription,
    themePhrase,
    articleSection: categoryLabel,
    jsonLdKeywords: keywords,
  };
}
