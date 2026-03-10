/**
 * Public config API. Used by report form to know e.g. whether to show Facebook consent.
 * Cached in memory (2 min TTL) to avoid repeated backend calls.
 * When cache is not there or fetch fails, we use true as default for both settings.
 */

const API_BASE =
  typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || '') : '';

const CONFIG_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

/** Default when cache is missing or backend unavailable. */
const DEFAULT_CONFIG: PublicConfigDto = {
  show_facebook_consent: true,
  show_report_scam: true,
};

export interface PublicConfigDto {
  show_facebook_consent: boolean;
  show_report_scam: boolean;
}

let cachedConfig: PublicConfigDto | null = null;
let cachedAt = 0;

/**
 * Fetch public config (no auth). Cached for CONFIG_CACHE_TTL_MS; after TTL or first load, calls backend.
 */
export async function getConfig(): Promise<PublicConfigDto> {
  const now = typeof Date !== 'undefined' ? Date.now() : 0;
  if (cachedConfig !== null && now - cachedAt < CONFIG_CACHE_TTL_MS) {
    return cachedConfig;
  }
  const res = await fetch(`${API_BASE}/config`);
  if (!res.ok) {
    return DEFAULT_CONFIG;
  }
  const data = await res.json();
  const result: PublicConfigDto = {
    show_facebook_consent: data.show_facebook_consent !== false,
    show_report_scam: data.show_report_scam !== false,
  };
  cachedConfig = result;
  cachedAt = Date.now();
  return result;
}

/**
 * Clear in-memory config cache. Call after admin updates settings so next getConfig() refetches.
 */
export function invalidateConfigCache(): void {
  cachedConfig = null;
  cachedAt = 0;
}
