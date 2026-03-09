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
