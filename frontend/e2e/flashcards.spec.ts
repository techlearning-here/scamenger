import { test, expect } from '@playwright/test';

const STORY_URL = '/stories/i-won-lottery-i-never-entered/';

test.describe('FlashCards — i-won-lottery-i-never-entered', () => {

  test('flashcard section is visible on the story page', async ({ page }) => {
    await page.goto(STORY_URL);
    const section = page.locator('.flashcards-section');
    await expect(section).toBeVisible();
  });

  test('shows card 1 of N with a question label and statement', async ({ page }) => {
    await page.goto(STORY_URL);
    await expect(page.locator('.flashcards-dot--active')).toBeVisible();
    await expect(page.locator('.flashcard__label')).toBeVisible();
    await expect(page.locator('.flashcard__statement')).toBeVisible();
    await expect(page.locator('.flashcard__hint')).toContainText('Tap to flip');
  });

  test('card flips on click and reveals the answer', async ({ page }) => {
    await page.goto(STORY_URL);

    // Back face should not be visible before flip
    await expect(page.locator('.flashcard__verdict')).not.toBeVisible();

    // Click the card to flip
    await page.locator('.flashcard-scene').click();

    // Card should now have the flipped class
    await expect(page.locator('.flashcard--flipped')).toBeVisible();

    // Verdict on the back face should now be visible
    await expect(page.locator('.flashcard__verdict')).toBeVisible();
  });

  test('Got it / Missed it buttons appear after flip', async ({ page }) => {
    await page.goto(STORY_URL);

    await expect(page.locator('.flashcards-btn--got')).not.toBeVisible();
    await page.locator('.flashcard-scene').click();

    await expect(page.locator('.flashcards-btn--got')).toBeVisible();
    await expect(page.locator('.flashcards-btn--missed')).toBeVisible();
  });

  test('Got it advances to the next card', async ({ page }) => {
    await page.goto(STORY_URL);

    await page.locator('.flashcard-scene').click();
    await page.locator('.flashcards-btn--got').click();

    // Card should have flipped back (not flipped class)
    await expect(page.locator('.flashcard--flipped')).not.toBeVisible();

    // Second dot should now be active
    const dots = page.locator('.flashcards-dot');
    await expect(dots.nth(0)).toHaveClass(/flashcards-dot--done/);
    await expect(dots.nth(1)).toHaveClass(/flashcards-dot--active/);
  });

  test('completing all cards shows the results screen with score', async ({ page }) => {
    await page.goto(STORY_URL);

    // Count total cards from dots
    const dotCount = await page.locator('.flashcards-dot').count();

    for (let i = 0; i < dotCount; i++) {
      await page.locator('.flashcard-scene').click();
      await page.locator('.flashcards-btn--got').click();
    }

    await expect(page.locator('.flashcards-results')).toBeVisible();
    await expect(page.locator('.flashcards-score-num')).toHaveText(String(dotCount));
    await expect(page.locator('.flashcards-retry-btn')).toBeVisible();
  });

  test('Try again resets the deck', async ({ page }) => {
    await page.goto(STORY_URL);

    const dotCount = await page.locator('.flashcards-dot').count();
    for (let i = 0; i < dotCount; i++) {
      await page.locator('.flashcard-scene').click();
      await page.locator('.flashcards-btn--got').click();
    }

    await page.locator('.flashcards-retry-btn').click();

    // Should be back to card 1
    await expect(page.locator('.flashcard--flipped')).not.toBeVisible();
    await expect(page.locator('.flashcards-dot--active')).toHaveCount(1);
    await expect(page.locator('.flashcard__statement')).toBeVisible();
  });

});
