import { describe, it, expect } from 'vitest';
import { getToolsForCountry } from './tools';

describe('tools data', () => {
  it('getToolsForCountry returns non-empty sections for US', () => {
    const sections = getToolsForCountry('US');
    expect(Array.isArray(sections)).toBe(true);
    expect(sections.length).toBeGreaterThan(0);
    for (const section of sections) {
      expect(section).toHaveProperty('heading');
      expect(section).toHaveProperty('intro');
      expect(Array.isArray(section.links)).toBe(true);
    }
  });

  it('US sections include Report a scam to Scam Avenger link', () => {
    const sections = getToolsForCountry('US');
    const allLinks = sections.flatMap((s) => s.links);
    const scamAvengerLink = allLinks.find(
      (l) => l.label === 'Report a scam to Scam Avenger' && l.href === '/report/'
    );
    expect(scamAvengerLink).toBeDefined();
    expect(scamAvengerLink?.external).toBe(false);
  });

  it('sections are ordered Identity & credit, Protect & avoid scams, Recover', () => {
    const sections = getToolsForCountry('US');
    expect(sections[0].heading).toMatch(/Identity & credit/);
    expect(sections[1].heading).toMatch(/Protect & avoid scams/);
    expect(sections[2].heading).toMatch(/Recover/);
  });

  it('getToolsForCountry falls back to US for unknown code', () => {
    const sections = getToolsForCountry('XX');
    expect(sections.length).toBeGreaterThan(0);
    const allLinks = sections.flatMap((s) => s.links);
    expect(allLinks.some((l) => l.href === '/report/')).toBe(true);
  });

  it('getToolsForCountry accepts lowercase country code', () => {
    const sections = getToolsForCountry('gb');
    expect(sections.length).toBeGreaterThan(0);
    const allLinks = sections.flatMap((s) => s.links);
    expect(allLinks.some((l) => l.label === 'Report a scam to Scam Avenger')).toBe(true);
  });
});
