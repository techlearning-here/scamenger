/**
 * URL helpers for the books page: seller domain and favicon URLs.
 */

/**
 * Returns the hostname for a URL (e.g. "amazon.com"), or "retailer" if invalid.
 */
export function getSellerDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
  } catch {
    return 'retailer';
  }
}

/**
 * Returns Google favicon service URL for a given site URL, or null if URL is invalid.
 */
export function getWebsiteFaviconUrl(url: string): string | null {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return null;
  }
}
