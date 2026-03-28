import type { FlashCard } from '@/components/FlashCards';
import type { UsScamType } from '@/data/scams/types';
import type { StoryContent } from '@/data/scam-stories-content/types';

/** Strips **bold** markers used in story content strings. */
function stripBold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1');
}

/** Paragraph separator used in story content. */
const PARA_SEP = '\u2029';

/**
 * Builds flashcards from a scam type entry's spotIt / dos / donts fields.
 * Front: a statement to evaluate. Back: the correct answer + brief reason.
 * Used on /us/scams/[slug] pages.
 */
export function buildScamCards(
  scam: Pick<UsScamType, 'spotIt' | 'dos' | 'donts'>
): FlashCard[] {
  const cards: FlashCard[] = [];

  for (const tip of scam.spotIt ?? []) {
    cards.push({
      question: `Warning sign or normal?\n\n"${tip}"`,
      answer: `Warning sign — This is a key red flag.\n\n${tip}`,
    });
  }

  for (const item of scam.dos ?? []) {
    cards.push({
      question: `Right or wrong?\n\n"${item}"`,
      answer: `Right — Always do this.\n\n${item}`,
    });
  }

  for (const item of scam.donts ?? []) {
    cards.push({
      question: `Right or wrong?\n\n"${item}"`,
      answer: `Wrong — Never do this.\n\n${item}`,
    });
  }

  return cards;
}

/**
 * Builds flashcards from a story's content.
 * Uses scamExperience paragraphs and learningForReaders items.
 * Used on /stories/[slug] pages.
 */
export function buildStoryCards(content: StoryContent): FlashCard[] {
  const cards: FlashCard[] = [];

  const scamParas = content.scamExperience
    .split(PARA_SEP)
    .map((p) => stripBold(p.trim()))
    .filter(Boolean);

  for (const para of scamParas) {
    cards.push({
      question: `True or false?\n\n"${para}"`,
      answer: `True — ${para}`,
    });
  }

  for (const item of content.learningForReaders) {
    const clean = stripBold(item);
    cards.push({
      question: `True or false?\n\n"${clean}"`,
      answer: `True — ${clean}`,
    });
  }

  return cards;
}
