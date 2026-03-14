import { describe, it, expect } from 'vitest';
import { getSellerDomain, getWebsiteFaviconUrl } from './books-utils';

describe('getSellerDomain', () => {
  it('returns hostname without www', () => {
    expect(getSellerDomain('https://www.amazon.com/dp/123')).toBe('amazon.com');
    expect(getSellerDomain('https://www.consumer.ftc.gov/')).toBe('consumer.ftc.gov');
  });

  it('returns hostname as-is when no www', () => {
    expect(getSellerDomain('https://reportfraud.ftc.gov/')).toBe('reportfraud.ftc.gov');
  });

  it('returns "retailer" for invalid URL', () => {
    expect(getSellerDomain('not-a-url')).toBe('retailer');
    expect(getSellerDomain('')).toBe('retailer');
  });
});

describe('getWebsiteFaviconUrl', () => {
  it('returns Google favicon URL for valid hostname', () => {
    const url = getWebsiteFaviconUrl('https://www.khanacademy.org/college-careers-more/financial-literacy');
    expect(url).toContain('https://www.google.com/s2/favicons?domain=');
    expect(url).toContain('&sz=32');
    expect(url).toContain('khanacademy.org');
  });

  it('returns null for invalid URL', () => {
    expect(getWebsiteFaviconUrl('')).toBeNull();
    expect(getWebsiteFaviconUrl('not-a-url')).toBeNull();
  });
});
