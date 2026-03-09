/**
 * Shared types and labels for US scam content.
 * Used by category data files and the main us-scams entry point.
 */

export interface ScamReport {
  who: string;
  when: string;
  prepare?: string[];
  href: string;
  label: string;
}

/** One FAQ item for the scam detail page */
export interface ScamFaqItem {
  question: string;
  answer: string;
}

/** External "learn more" link (e.g. FTC consumer tips) */
export interface ScamLearnMoreLink {
  label: string;
  href: string;
}

export type ScamCategoryId =
  | 'online'
  | 'phone'
  | 'financial'
  | 'impersonation'
  | 'employment'
  | 'housing'
  | 'prizes_charity'
  | 'identity_benefits'
  | 'government'
  | 'emerging'
  | 'other';

export interface UsScamType {
  slug: string;
  name: string;
  category: ScamCategoryId;
  /** Short scenario that illustrates how this scam typically plays out (modus operandi). */
  story: string;
  /** Optional tips for how to spot this scam (red flags). */
  spotIt?: string[];
  /** Optional do's: positive actions to take. */
  dos?: string[];
  /** Optional don'ts: things to avoid. */
  donts?: string[];
  intro: string;
  steps: string[];
  reports: ScamReport[];
  /** Optional one-line urgent warning (e.g. "Never pay by gift card."). */
  warning?: string;
  /** Optional statistics or factoids (e.g. "FTC received 2.6M fraud reports in 2023."). */
  statistics?: string[];
  /** Optional slugs of related scams for "Related scams" section. */
  relatedSlugs?: string[];
  /** Optional FAQ items. */
  faq?: ScamFaqItem[];
  /** Optional "Learn more" / consumer education links (not reporting). */
  learnMore?: ScamLearnMoreLink[];
}

/** Human-readable category labels for display */
export const SCAM_CATEGORY_LABELS: Record<ScamCategoryId, string> = {
  online: 'Online & communication',
  phone: 'Phone & mail',
  financial: 'Financial & banking',
  impersonation: 'Impersonation',
  employment: 'Employment & opportunity',
  housing: 'Housing & rental',
  prizes_charity: 'Prizes & charity',
  identity_benefits: 'Identity & benefits',
  government: 'Government & oversight',
  emerging: 'Emerging & other',
  other: 'Other',
};
