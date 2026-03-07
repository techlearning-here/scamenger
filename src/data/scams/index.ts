/**
 * US scams data and getters. Re-exported by us-scams.ts for backward compatibility.
 */

export type { ScamCategoryId, ScamFaqItem, ScamLearnMoreLink, ScamReport, UsScamType } from './types';
export { SCAM_CATEGORY_LABELS } from './types';

import { US_SCAMS } from './data';
import type { ScamCategoryId, UsScamType } from './types';

export function getUsScamTypes(): UsScamType[] {
  return US_SCAMS;
}

export function getUsScamBySlug(slug: string): UsScamType | undefined {
  return US_SCAMS.find((s) => s.slug === slug);
}

export function getUsScamSlugs(): string[] {
  return US_SCAMS.map((s) => s.slug);
}

export function getUsScamCategories(): ScamCategoryId[] {
  const seen = new Set<ScamCategoryId>();
  return US_SCAMS.map((s) => s.category).filter((c) => {
    if (seen.has(c)) return false;
    seen.add(c);
    return true;
  });
}
