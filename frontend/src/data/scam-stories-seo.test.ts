import { describe, expect, it } from 'vitest';
import type { StoryContent } from '@/data/scam-stories-content/types';
import {
  buildStoryExcerptPlain,
  enhanceStorySeoWithContent,
  getStorySeo,
  normalizeStoryFieldForMeta,
} from '@/data/scam-stories-seo';

describe('normalizeStoryFieldForMeta', () => {
  it('removes bold markers and paragraph separators', () => {
    expect(normalizeStoryFieldForMeta('Pay **taxes** now.\u2029Done.')).toBe('Pay taxes now. Done.');
  });
});

describe('buildStoryExcerptPlain', () => {
  const sample: StoryContent = {
    characterIntro: 'I lost money to a **fake** job.',
    initialPlot: 'They asked for fees first.\u2029I paid.',
    scamExperience: 'The company vanished.',
    victimExperience: 'I felt ashamed.',
    climax: 'I reported it.',
    victimPain: 'Recovery took months.',
    learningVictim: 'I verify employers now.',
    learningForReaders: ['Report to the FTC.'],
  };

  it('respects max length with ellipsis when needed', () => {
    const longIntro = `${'word '.repeat(80)}end`;
    const long: StoryContent = { ...sample, characterIntro: longIntro };
    const out = buildStoryExcerptPlain(long, 60);
    expect(out.length).toBeLessThanOrEqual(60);
    expect(out.endsWith('…')).toBe(true);
  });

  it('returns full text when under max', () => {
    const out = buildStoryExcerptPlain(sample, 500);
    expect(out).toContain('fake');
    expect(out).toContain('fees first');
    expect(out).not.toContain('**');
  });
});

describe('enhanceStorySeoWithContent', () => {
  it('returns base SEO when content is null', () => {
    const base = getStorySeo('financial', 'Financial', 'Short title');
    expect(enhanceStorySeoWithContent(base, null)).toBe(base);
  });

  it('overrides descriptions when excerpt is long enough', () => {
    const base = getStorySeo('financial', 'Financial', 'Investment loss story');
    const content: StoryContent = {
      characterIntro:
        'I was in my fifties when a polished website promised safe returns and a friendly advisor on the phone.',
      initialPlot:
        'I deposited twice; withdrawals stalled behind tax fees until the line went dead.',
      scamExperience: 'The platform was fake and the number disconnected.',
      victimExperience: 'Shame kept me quiet for weeks.',
      climax: 'Regulator warnings matched the logo.',
      victimPain: 'Savings were gone.',
      learningVictim: 'I verify with my bank now.',
      learningForReaders: ['Report fraud.'],
    };
    const enhanced = enhanceStorySeoWithContent(base, content);
    expect(enhanced.metaDescription).not.toBe(base.metaDescription);
    expect(enhanced.metaDescription.length).toBeLessThanOrEqual(158);
    expect(enhanced.ogDescription.length).toBeLessThanOrEqual(200);
    expect(enhanced.metaTitle).toBe(base.metaTitle);
  });
});
