/**
 * Recommended books for financial literacy and fraud awareness.
 * Product URLs are direct Amazon (or other retailer) links; affiliate tag is appended at render time via env.
 */

export type BookCategory = 'financial-literacy' | 'fraud-awareness' | 'identity-security';

export interface BookEntry {
  title: string;
  author: string;
  description: string;
  /** Direct product URL (e.g. https://www.amazon.com/dp/ASIN). Affiliate tag appended when set in env. */
  url: string;
  category: BookCategory;
  /** Optional book cover image URL (e.g. Open Library or Amazon CDN). */
  coverUrl?: string;
  /** One-line "Best for" or "Why we recommend" to help readers choose. */
  bestFor?: string;
  /** Format or edition, e.g. "Paperback / Kindle", "2nd ed." */
  formatOrEdition?: string;
  /** Optional badge to highlight the book, e.g. "Staff pick" or "Popular". */
  badge?: 'staff-pick' | 'popular';
}

/** ISO date when the books/list was last updated. Used for "List last updated" line. */
export const BOOKS_LIST_LAST_UPDATED = '2025-03-11';

/** Open Library Covers API — use ISBN for cover image. */
const cover = (isbn: string) => `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

export const BOOK_ENTRIES: BookEntry[] = [
  {
    title: 'I Will Teach You to Be Rich',
    author: 'Ramit Sethi',
    description: 'Practical guide to personal finance, banking, credit, and investing. Builds habits that reduce vulnerability to financial scams.',
    url: 'https://www.amazon.com/dp/1523505746',
    category: 'financial-literacy',
    coverUrl: cover('9781523505746'),
    bestFor: 'Beginners who want a step-by-step system.',
    formatOrEdition: 'Paperback / Kindle',
    badge: 'staff-pick',
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    description: 'Short stories on how people think about money and risk. Helps build a healthier mindset and avoid impulsive or scam-driven decisions.',
    url: 'https://www.amazon.com/dp/0857197681',
    category: 'financial-literacy',
    coverUrl: cover('9780857197689'),
    bestFor: 'Anyone wanting a calmer, long-term view of money.',
    formatOrEdition: 'Paperback / Kindle / Audiobook',
    badge: 'popular',
  },
  {
    title: 'Your Money or Your Life',
    author: 'Vicki Robin, Joe Dominguez',
    description: 'Classic on aligning spending with values and building financial independence. Strengthens awareness of where money goes and how to protect it.',
    url: 'https://www.amazon.com/dp/0143115762',
    category: 'financial-literacy',
    coverUrl: cover('9780143115762'),
    bestFor: 'Values-based spending and financial independence.',
    formatOrEdition: 'Paperback / Kindle (2nd ed.)',
  },
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    description: 'Introduces assets vs. liabilities and why financial education matters. Influential for shifting how people think about building wealth.',
    url: 'https://www.amazon.com/dp/1612680194',
    category: 'financial-literacy',
    coverUrl: cover('9781612680194'),
    bestFor: 'Reframing how you think about assets and income.',
    formatOrEdition: 'Paperback / Kindle',
  },
  {
    title: 'Clever Girl Finance: Ditch Debt, Save Money and Build Real Wealth',
    author: 'Bola Sokunbi',
    description: 'Actionable steps to get out of debt, save, and build wealth. Geared toward building confidence and a clear money plan.',
    url: 'https://www.amazon.com/dp/1119580838',
    category: 'financial-literacy',
    coverUrl: cover('9781119580836'),
    bestFor: 'Getting out of debt and building a savings habit.',
    formatOrEdition: 'Paperback / Kindle',
  },
  {
    title: 'What They Don\'t Teach You About Money',
    author: 'Clémentine Boisneau',
    description: 'Accessible money basics and habits often missing from school. Helps readers avoid common pitfalls and make informed decisions.',
    url: 'https://www.amazon.com/dp/152914633X',
    category: 'financial-literacy',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71Zof+8GKCL._AC_UL232_SR232,232_.jpg',
    bestFor: 'Quick, practical money basics and habits.',
    formatOrEdition: 'Paperback / Kindle',
  },
  {
    title: 'Swiped: How to Protect Yourself in a World Full of Scammers, Phishers, and Identity Thieves',
    author: 'Adam Levin',
    description: 'Practical guide to minimizing risk, monitoring your identity, and managing damage. Covers financial, criminal, medical, and familial identity theft.',
    url: 'https://www.amazon.com/dp/0316487170',
    category: 'fraud-awareness',
    coverUrl: 'https://m.media-amazon.com/images/I/614KtLjfLeL._AC_UY218_.jpg',
    bestFor: 'After a scam or to harden defenses.',
    formatOrEdition: 'Paperback / Kindle',
  },
  {
    title: 'Stealing Your Life: The Ultimate Identity Theft Prevention Guide',
    author: 'Frank Abagnale',
    description: 'From the former con artist behind Catch Me If You Can: how identity thieves operate and how to protect yourself.',
    url: 'https://www.amazon.com/dp/0767925866',
    category: 'identity-security',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71ReF3cOoWL._AC_UL232_SR232,232_.jpg',
    bestFor: 'Understanding how identity thieves think and act.',
    formatOrEdition: 'Paperback / Kindle',
  },
];

const CATEGORY_LABELS: Record<BookCategory, string> = {
  'financial-literacy': 'Financial literacy',
  'fraud-awareness': 'Fraud & scam awareness',
  'identity-security': 'Identity & security',
};

export function getCategoryLabel(category: BookCategory): string {
  return CATEGORY_LABELS[category];
}

/**
 * Returns the product URL with affiliate tag appended when NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG is set.
 */
export function getBookProductUrl(url: string): string {
  const tag =
    typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG?.trim();
  if (!tag || !url) return url;
  try {
    const u = new URL(url);
    u.searchParams.set('tag', tag);
    return u.toString();
  } catch {
    return url;
  }
}

export function getBooksByCategory(): Map<BookCategory, BookEntry[]> {
  const map = new Map<BookCategory, BookEntry[]>();
  for (const book of BOOK_ENTRIES) {
    const list = map.get(book.category) ?? [];
    list.push(book);
    map.set(book.category, list);
  }
  return map;
}

/** Categories for free websites & tools. */
export type WebsiteCategory = 'official-government' | 'education-tools';

export interface WebsiteEntry {
  name: string;
  description: string;
  url: string;
  category: WebsiteCategory;
}

export const WEBSITE_ENTRIES: WebsiteEntry[] = [
  {
    name: 'FTC Consumer Advice',
    description: 'Official FTC guidance on spotting, avoiding, and reporting scams and fraud.',
    url: 'https://consumer.ftc.gov/',
    category: 'official-government',
  },
  {
    name: 'Report Fraud to the FTC',
    description: 'Report scams, fraud, and bad business practices to the Federal Trade Commission.',
    url: 'https://reportfraud.ftc.gov/',
    category: 'official-government',
  },
  {
    name: 'IdentityTheft.gov',
    description: 'Step-by-step identity theft reporting and recovery (US). Official government resource.',
    url: 'https://www.identitytheft.gov/',
    category: 'official-government',
  },
  {
    name: 'MyMoney.gov',
    description: 'US government financial education: Money Smart tools, identity theft guides, and more.',
    url: 'https://www.mymoney.gov/',
    category: 'official-government',
  },
  {
    name: 'Khan Academy – Financial Literacy',
    description: 'Free courses on money basics, saving, budgeting, and investing.',
    url: 'https://www.khanacademy.org/college-careers-more/financial-literacy',
    category: 'education-tools',
  },
  {
    name: 'Next Gen Personal Finance (NGPF)',
    description: 'Free curriculum, banking simulators, and activities for financial literacy.',
    url: 'https://www.ngpf.org/',
    category: 'education-tools',
  },
  {
    name: 'Investopedia – Financial Literacy',
    description: 'Articles and guides on budgeting, saving, investing, and financial basics.',
    url: 'https://www.investopedia.com/financial-literacy-resource-center-7151950',
    category: 'education-tools',
  },
  {
    name: 'Know Your Money',
    description: 'Expert-reviewed content, calculators, and tools for different life stages.',
    url: 'https://www.knowyourmoney.org/',
    category: 'education-tools',
  },
];

const WEBSITE_CATEGORY_LABELS: Record<WebsiteCategory, string> = {
  'official-government': 'Official & government',
  'education-tools': 'Education & tools',
};

export function getWebsiteCategoryLabel(category: WebsiteCategory): string {
  return WEBSITE_CATEGORY_LABELS[category];
}

export function getWebsitesByCategory(): Map<WebsiteCategory, WebsiteEntry[]> {
  const map = new Map<WebsiteCategory, WebsiteEntry[]>();
  for (const site of WEBSITE_ENTRIES) {
    const list = map.get(site.category) ?? [];
    list.push(site);
    map.set(site.category, list);
  }
  return map;
}
