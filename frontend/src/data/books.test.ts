import { describe, it, expect } from 'vitest';
import { getBookProductUrl, getCategoryLabel, BOOK_ENTRIES, getBooksByCategory } from './books';

describe('getBookProductUrl', () => {
  it('returns URL unchanged when tag is not set', () => {
    const url = 'https://www.amazon.com/dp/1523505746';
    expect(getBookProductUrl(url)).toBe(url);
  });

  it('appends tag when NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG is set', () => {
    const prev = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG;
    process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG = 'scamenger-20';
    try {
      const url = 'https://www.amazon.com/dp/1523505746';
      const result = getBookProductUrl(url);
      expect(result).toContain('tag=scamenger-20');
      expect(result).toContain('1523505746');
    } finally {
      process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG = prev;
    }
  });

  it('returns empty string unchanged', () => {
    expect(getBookProductUrl('')).toBe('');
  });
});

describe('getCategoryLabel', () => {
  it('returns label for each category', () => {
    expect(getCategoryLabel('financial-literacy')).toBe('Financial literacy');
    expect(getCategoryLabel('fraud-awareness')).toBe('Fraud & scam awareness');
    expect(getCategoryLabel('identity-security')).toBe('Identity & security');
  });
});

describe('BOOK_ENTRIES and getBooksByCategory', () => {
  it('has books in each category', () => {
    const byCategory = getBooksByCategory();
    expect(byCategory.get('financial-literacy')?.length).toBeGreaterThan(0);
    expect(byCategory.get('fraud-awareness')?.length).toBeGreaterThan(0);
    expect(byCategory.get('identity-security')?.length).toBeGreaterThan(0);
  });

  it('every book has direct product URL', () => {
    for (const book of BOOK_ENTRIES) {
      expect(book.url).toMatch(/^https:\/\//);
      expect(book.url).not.toContain('s?k=');
    }
  });
});
