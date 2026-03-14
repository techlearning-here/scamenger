import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BOOK_ENTRIES,
  BOOKS_LIST_LAST_UPDATED,
  WEBSITE_ENTRIES,
  getBookProductUrl,
  getBooksByCategory,
  getCategoryLabel,
  getWebsitesByCategory,
  getWebsiteCategoryLabel,
  type BookCategory,
  type WebsiteCategory,
} from '@/data/books';
import { getSellerDomain, getWebsiteFaviconUrl } from '@/lib/books-utils';
import { BooksPageBackToTop } from './BooksPageBackToTop';
import { BookCover } from './BookCover';
import { BooksCategoryFilter } from './BooksCategoryFilter';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const booksOgImage = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&h=630&q=80';

export const metadata: Metadata = {
  title: 'Recommended reading & resources: financial literacy & fraud awareness | Scam Avenger',
  description: 'Curated books and free websites on financial literacy, fraud awareness, and protecting your money and identity. We may earn a commission from qualifying book purchases.',
  keywords: [
    'financial literacy books',
    'fraud awareness books',
    'identity theft prevention',
    'scam prevention reading',
    'personal finance books',
    'consumer protection resources',
    'free financial education',
  ].join(', '),
  alternates: { canonical: `${siteUrl}/tools/books/` },
  openGraph: {
    title: 'Recommended reading & resources: financial literacy & fraud awareness | Scam Avenger',
    description: 'Curated books and free websites on financial literacy and fraud awareness. We may earn a commission from qualifying book purchases.',
    url: `${siteUrl}/tools/books/`,
    images: [{ url: booksOgImage, width: 1200, height: 630, alt: 'Recommended reading: financial literacy & fraud awareness' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recommended reading & resources: financial literacy & fraud awareness | Scam Avenger',
    description: 'Curated books and free websites on financial literacy and fraud awareness.',
    images: [booksOgImage],
  },
  robots: { index: true, follow: true },
};

export default function ToolsBooksPage() {
  const byCategory = getBooksByCategory();
  const categoryOrder: BookCategory[] = ['financial-literacy', 'fraud-awareness', 'identity-security'];
  const websitesByCategory = getWebsitesByCategory();
  const websiteCategoryOrder: WebsiteCategory[] = ['education-tools'];

  const itemListElements = [
    ...BOOK_ENTRIES.map((book, i) => ({
      '@type': 'ListItem' as const,
      position: i + 1,
      url: getBookProductUrl(book.url),
      name: book.title,
    })),
    ...WEBSITE_ENTRIES.filter((s) => websiteCategoryOrder.includes(s.category)).map((site, i) => ({
      '@type': 'ListItem' as const,
      position: BOOK_ENTRIES.length + i + 1,
      url: site.url,
      name: site.name,
    })),
  ];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Recommended reading & resources: financial literacy & fraud awareness',
    description: 'Curated books and free websites on financial literacy, fraud awareness, and protecting your money and identity.',
    numberOfItems: itemListElements.length,
    itemListElement: itemListElements,
  };

  const bookSchemasJsonLd = BOOK_ENTRIES.map((book) => ({
    '@context': 'https://schema.org',
    '@type': 'Book' as const,
    name: book.title,
    author: { '@type': 'Person' as const, name: book.author },
    description: book.description,
    ...(book.coverUrl && { image: book.coverUrl }),
    url: getBookProductUrl(book.url),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {bookSchemasJsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <Link href="/tools/">Tools</Link>
        <span className="back-sep"> / </span>
        <span>Recommended reading</span>
      </nav>
      <header className="tool-page-hero">
        <h1 id="tools-books-heading" className="tool-page-title">
          Recommended reading &amp; resources: financial literacy &amp; fraud awareness
        </h1>
        <p className="tool-page-intro">
          Books and free websites that help you build better money habits, spot scams, and protect your identity. We only recommend titles and resources we believe are useful for our readers.
        </p>
        <p id="books-affiliate-disclosure" className="tool-books-disclosure" role="note">
          <strong>Affiliate disclosure:</strong> Some book links below may be affiliate links. We may earn a commission from qualifying purchases at no extra cost to you. This helps us keep the site free. Website links are free resources; we are not paid to list them.
        </p>
        <p className="tool-page-cta">
          <Link href="/tools/">Back to Tools &amp; online services</Link>
        </p>
        <nav className="tool-books-jump-links" aria-label="Jump to section">
          <span className="tool-books-jump-label">Jump to:</span>
          <a href="#books-heading" className="tool-books-jump-link">Books</a>
          <span className="tool-books-jump-sep" aria-hidden>·</span>
          <a href="#websites-heading" className="tool-books-jump-link">Free websites &amp; tools</a>
        </nav>
      </header>

      <BooksCategoryFilter categoryOrder={categoryOrder}>
        <section className="tool-books-list" aria-label="Recommended books by category">
          <h2 id="books-heading" className="tool-books-section-title">Books</h2>
          {categoryOrder.map((category) => {
            const books = byCategory.get(category);
            if (!books || books.length === 0) return null;
            return (
              <div key={category} className="tool-books-category" data-category={category}>
                <h3 id={`books-${category}`} className="tool-books-category-title">{getCategoryLabel(category)}</h3>
                <ul className="tool-books-cards">
                  {books.map((book) => {
                    const productUrl = getBookProductUrl(book.url);
                    return (
                      <li key={`${book.title}-${book.author}`}>
                        <a
                          href={productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tool-books-card"
                        >
                          {book.coverUrl && (
                            <span className="tool-books-card-cover-wrap">
                              <BookCover
                                src={book.coverUrl}
                                alt=""
                                width={80}
                                height={120}
                                className="tool-books-card-cover"
                              />
                            </span>
                          )}
                          <span className="tool-books-card-body">
                            {book.badge && (
                              <span className={`tool-books-card-badge tool-books-card-badge--${book.badge}`}>
                                {book.badge === 'staff-pick' ? 'Staff pick' : 'Popular'}
                              </span>
                            )}
                            <span className="tool-books-card-title">{book.title}</span>
                            <span className="tool-books-card-author">{book.author}</span>
                            {book.bestFor && (
                              <span className="tool-books-card-best-for">Best for: {book.bestFor}</span>
                            )}
                            <span className="tool-books-card-desc">{book.description}</span>
                            {book.formatOrEdition && (
                              <span className="tool-books-card-format">{book.formatOrEdition}</span>
                            )}
                            <span className="tool-books-card-link">View on {getSellerDomain(book.url)} →</span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </section>
      </BooksCategoryFilter>

      <section className="tool-websites-list" aria-label="Free websites and tools">
        <h2 id="websites-heading" className="tool-books-section-title">Free websites &amp; tools</h2>
        {websiteCategoryOrder.map((category) => {
          const sites = websitesByCategory.get(category);
          if (!sites || sites.length === 0) return null;
          return (
            <div key={category} className="tool-books-category">
              <h3 id={`websites-${category}`} className="tool-books-category-title">{getWebsiteCategoryLabel(category)}</h3>
              <ul className="tool-books-cards tool-websites-cards">
                {sites.map((site) => {
                  const faviconUrl = getWebsiteFaviconUrl(site.url);
                  return (
                    <li key={site.url}>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tool-books-card tool-website-card"
                      >
                        {faviconUrl && (
                          <span className="tool-website-favicon-wrap">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={faviconUrl}
                              alt=""
                              className="tool-website-favicon"
                              width={24}
                              height={24}
                              loading="lazy"
                            />
                          </span>
                        )}
                        <span className="tool-books-card-body">
                          <span className="tool-books-card-title">{site.name}</span>
                          <span className="tool-website-domain">{getSellerDomain(site.url)}</span>
                          <span className="tool-books-card-desc">{site.description}</span>
                          <span className="tool-books-card-link">Visit {getSellerDomain(site.url)} →</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>

      <BooksPageBackToTop />
      <p className="tool-books-last-updated">
        List last updated: {new Date(BOOKS_LIST_LAST_UPDATED + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      <p className="tool-page-cta tool-books-footer-cta">
        <a href="#books-affiliate-disclosure" className="tool-books-disclosure-link">Affiliate disclosure</a>
        <span className="tool-books-footer-sep" aria-hidden> · </span>
        <Link href="/tools/">Back to Tools &amp; online services</Link>
      </p>
    </>
  );
}
