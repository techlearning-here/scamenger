import { describe, it, expect } from 'vitest';
import { getUsScamBySlug, getUsScamSlugs, getUsScamTypes } from '@/data/us-scams';

describe('us-scams data', () => {
  it('getUsScamSlugs returns non-empty array', () => {
    const slugs = getUsScamSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    expect(slugs.length).toBeGreaterThan(0);
  });

  it('getUsScamTypes returns items with slug and name', () => {
    const types = getUsScamTypes();
    expect(types.length).toBeGreaterThan(0);
    types.forEach((s) => {
      expect(s).toHaveProperty('slug');
      expect(s).toHaveProperty('name');
      expect(typeof s.slug).toBe('string');
      expect(typeof s.name).toBe('string');
    });
  });

  it('getUsScamBySlug returns scam for known slug', () => {
    const scam = getUsScamBySlug('phishing');
    expect(scam).toBeDefined();
    expect(scam?.slug).toBe('phishing');
    expect(scam?.name).toBeDefined();
    expect(scam?.intro).toBeDefined();
    expect(scam?.reports).toBeDefined();
    expect(Array.isArray(scam?.reports)).toBe(true);
  });

  it('getUsScamBySlug returns undefined for unknown slug', () => {
    expect(getUsScamBySlug('nonexistent-slug-xyz')).toBeUndefined();
  });
});
