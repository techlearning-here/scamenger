/**
 * Country options for scam-origin dropdown (ISO 3166-1 alpha-2 + name).
 * Ordered: US first, then alphabetical by name.
 */
export const COUNTRY_OPTIONS: { value: string; label: string }[] = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'PH', label: 'Philippines' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'OTHER', label: 'Other / Unknown' },
];

const VALID_COUNTRY_CODES = new Set(COUNTRY_OPTIONS.map((o) => o.value));

/**
 * Map locale (e.g. "en-US") or language (e.g. "en") to a country code in COUNTRY_OPTIONS.
 * Uses navigator.language and navigator.languages (client-only).
 * Returns null when not in browser or no match.
 */
export function getCountryFromLocale(): string | null {
  if (typeof navigator === 'undefined' || !navigator.language) return null;
  const languages = navigator.languages?.length ? Array.from(navigator.languages) : [navigator.language];
  for (const lang of languages) {
    const normalized = String(lang).trim();
    const parts = normalized.split('-');
    const region = parts.length >= 2 ? parts[1].toUpperCase() : null;
    if (region && VALID_COUNTRY_CODES.has(region)) return region;
  }
  if (navigator.language.startsWith('en') && !navigator.language.includes('-')) return 'US';
  return null;
}
