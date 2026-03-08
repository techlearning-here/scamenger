/**
 * US scam types with categories. Based on FTC, IC3, and consumer protection sources (2024–2026).
 * Used by the index topics table and /us/scams/[slug] detail pages.
 *
 * Data and types live under ./scams/ for easier management; this file re-exports for backward compatibility.
 */

export {
  SCAM_CATEGORY_LABELS,
  getUsScamBySlug,
  getUsScamCategories,
  getUsScamSlugs,
  getUsScamTypes,
} from './scams';
export type { ScamCategoryId, ScamFaqItem, ScamLearnMoreLink, ScamReport, UsScamType } from './scams';
