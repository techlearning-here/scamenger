/**
 * Icons (emoji) for scam types and categories. Used by ScamCard for card-based category lists.
 * Slug overrides take precedence; otherwise category default is used.
 */

import type { ScamCategoryId } from './types';

/** Emoji per category for fallback when slug has no override */
export const SCAM_CATEGORY_ICONS: Record<ScamCategoryId, string> = {
  online: '🖥️',
  phone: '📞',
  financial: '💳',
  impersonation: '🎭',
  employment: '💼',
  housing: '🏠',
  prizes_charity: '🎁',
  identity_benefits: '🪪',
  government: '🏛️',
  emerging: '⚡',
  other: '📋',
};

/** Slug-specific emoji overrides for well-known scam types */
const SLUG_ICONS: Record<string, string> = {
  phishing: '🎣',
  smishing: '📱',
  romance: '💘',
  'irs-tax-impersonation': '💸',
  'identity-theft': '🪪',
  'job-employment': '💼',
  'robocalls-phone': '📞',
  'bank-zelle-transfer': '💳',
  'fake-shopping': '🛒',
  'investment-crypto': '₿',
  'pig-butchering': '🐷',
  'charity-donation': '❤️',
  'prize-sweepstakes-lottery': '🎰',
  'tech-support': '🛟',
  'government-imposter': '🏛️',
  'family-emergency-grandparent': '👴',
  'elder-fraud-resources': '👵',
  'ai-deepfake-scams': '🤖',
};

/**
 * Returns the emoji icon for a scam type. Uses slug override if present, else category default.
 */
export function getScamIcon(slug: string, category: ScamCategoryId): string {
  return SLUG_ICONS[slug] ?? SCAM_CATEGORY_ICONS[category] ?? '📋';
}
