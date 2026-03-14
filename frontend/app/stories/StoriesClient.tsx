'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { SCAM_STORY_ENTRIES, FEATURED_STORY_SLUGS, getHardshipTag, HARDSHIP_TAG_LABELS } from '@/data/scam-stories';
import { SCAM_CATEGORY_ICONS } from '@/data/scams/icons';
import { SCAM_CATEGORY_LABELS, type ScamCategoryId } from '@/data/scams/types';
import { ChevronDownIcon, ChevronUpIcon } from './StickyIcons';

/** Show back-to-top when user is within this many px of the bottom of the page. */
const BACK_TO_TOP_NEAR_BOTTOM_PX = 200;
const LATEST_STORIES_COUNT = 6;

const ALL_CATEGORIES = 'all';

type SortOption = 'default' | 'title' | 'category' | 'newest';

function normalizeForSearch(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Client component: scam story cards with search, category filter, featured row, and sort.
 */
export function StoriesClient() {
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredStories = useMemo(() => {
    return FEATURED_STORY_SLUGS.map((slug) =>
      SCAM_STORY_ENTRIES.find((e) => e.slug === slug)
    ).filter((e): e is NonNullable<typeof e> => e != null);
  }, []);

  const latestStories = useMemo(() => {
    return [...SCAM_STORY_ENTRIES].reverse().slice(0, LATEST_STORIES_COUNT);
  }, []);

  const totalMatchingCount = useMemo(() => {
    let list = categoryFilter === ALL_CATEGORIES
      ? SCAM_STORY_ENTRIES
      : SCAM_STORY_ENTRIES.filter((s) => s.category === categoryFilter);
    const query = normalizeForSearch(searchQuery);
    if (query) {
      list = list.filter((s) => normalizeForSearch(s.title).includes(query));
    }
    return list.length;
  }, [categoryFilter, searchQuery]);

  const filteredStories = useMemo(() => {
    let list = categoryFilter === ALL_CATEGORIES
      ? [...SCAM_STORY_ENTRIES]
      : SCAM_STORY_ENTRIES.filter((s) => s.category === categoryFilter);

    const query = normalizeForSearch(searchQuery);
    if (query) {
      list = list.filter((s) => normalizeForSearch(s.title).includes(query));
    }

    const featuredSet = new Set(FEATURED_STORY_SLUGS);
    list = list.filter((s) => !featuredSet.has(s.slug));
    const showLatest = searchQuery.trim() === '' && categoryFilter === ALL_CATEGORIES;
    if (showLatest && latestStories.length > 0) {
      const latestSlugs = new Set(latestStories.map((s) => s.slug));
      list = list.filter((s) => !latestSlugs.has(s.slug));
    }

    if (sortBy === 'title') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
    } else if (sortBy === 'category') {
      list = [...list].sort((a, b) => {
        const catCmp = SCAM_CATEGORY_LABELS[a.category].localeCompare(SCAM_CATEGORY_LABELS[b.category], undefined, { sensitivity: 'base' });
        return catCmp !== 0 ? catCmp : a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
      });
    } else if (sortBy === 'newest') {
      list = [...list].reverse();
    }
    return list;
  }, [categoryFilter, sortBy, searchQuery]);

  const categoryOptions = useMemo(() => {
    const seen = new Set<ScamCategoryId>();
    SCAM_STORY_ENTRIES.forEach((s) => seen.add(s.category));
    return Array.from(seen).sort((a, b) =>
      SCAM_CATEGORY_LABELS[a].localeCompare(SCAM_CATEGORY_LABELS[b])
    );
  }, []);

  const showFeatured = searchQuery.trim() === '' && categoryFilter === ALL_CATEGORIES;

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isStickyCollapsed, setIsStickyCollapsed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const { scrollY, innerHeight } = window;
      const scrollHeight = document.documentElement.scrollHeight;
      const nearBottom = scrollY + innerHeight >= scrollHeight - BACK_TO_TOP_NEAR_BOTTOM_PX;
      setShowBackToTop(nearBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="stories-page-content" id="stories-browse">
      <div className={`stories-sticky-wrap ${isStickyCollapsed ? 'stories-sticky-wrap--collapsed' : ''}`}>
        {isStickyCollapsed ? (
          <button
            type="button"
            className="stories-sticky-toggle"
            onClick={() => setIsStickyCollapsed(false)}
            aria-expanded="false"
            aria-label="Show search and filters"
          >
            <span className="stories-sticky-toggle-label">Search & filters</span>
            <ChevronDownIcon className="stories-sticky-toggle-icon" />
          </button>
        ) : null}
        <div className="stories-sticky-content">
        <div className="stories-search-wrap">
        <label htmlFor="stories-search" className="sr-only">Search stories by title</label>
        <input
          id="stories-search"
          type="search"
          className="stories-search-input"
          placeholder="Search stories by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search stories by title"
        />
      </div>

      <div className="stories-toolbar">
        <p className="stories-count" aria-live="polite">
          <span className="stories-count-num">{totalMatchingCount}</span>
          {' '}{totalMatchingCount === 1 ? 'story' : 'stories'}
          {searchQuery.trim() && ` matching "${searchQuery.trim()}"`}
        </p>
        <div className="stories-sort-wrap">
          <label htmlFor="stories-sort" className="stories-sort-label">Sort by</label>
          <select
            id="stories-sort"
            className="stories-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort stories"
          >
            <option value="default">Default</option>
            <option value="newest">Newest first</option>
            <option value="title">Title A–Z</option>
            <option value="category">Category A–Z</option>
          </select>
        </div>
        <div className="stories-filter-pills" role="group" aria-label="Filter by category">
          <button
            type="button"
            className={`stories-pill ${categoryFilter === ALL_CATEGORIES ? 'stories-pill-active' : ''}`}
            onClick={() => setCategoryFilter(ALL_CATEGORIES)}
            aria-pressed={categoryFilter === ALL_CATEGORIES}
          >
            All
          </button>
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`stories-pill ${categoryFilter === cat ? 'stories-pill-active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
              aria-pressed={categoryFilter === cat}
            >
              <span className="stories-pill-icon" aria-hidden="true">{SCAM_CATEGORY_ICONS[cat]}</span>
              {SCAM_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        <div className="stories-filter-select-wrap">
          <label htmlFor="stories-category-filter" className="sr-only">Filter by category</label>
          <select
            id="stories-category-filter"
            className="stories-filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter stories by category"
          >
            <option value={ALL_CATEGORIES}>All categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {SCAM_CATEGORY_ICONS[cat]} {SCAM_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="stories-sticky-collapse-btn"
          onClick={() => setIsStickyCollapsed(true)}
          aria-expanded="true"
          aria-label="Collapse search and filters"
        >
          <ChevronUpIcon className="stories-sticky-toggle-icon" />
        </button>
      </div>
      </div>
      </div>

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="stories-back-to-top"
          aria-label="Back to top"
        >
          <ChevronUpIcon className="stories-back-to-top-icon" />
        </button>
      )}

      {showFeatured && featuredStories.length > 0 && (
        <section className="stories-featured" aria-label="Start here">
          <h2 className="stories-featured-title">Start here</h2>
          <ul className="stories-grid stories-grid--featured" role="list">
            {featuredStories.map((entry) => (
              <li key={entry.slug} className="stories-card-wrap">
                <Link
                  href={`/stories/${entry.slug}`}
                  className={`stories-card stories-card--${entry.category} stories-card--featured`}
                >
                  <span className="stories-card-meta">
                    <span className="stories-card-icon" aria-hidden="true">
                      {SCAM_CATEGORY_ICONS[entry.category]}
                    </span>
                    <span className="stories-card-category">
                      {SCAM_CATEGORY_LABELS[entry.category]}
                    </span>
                  </span>
                  <span className={`stories-card-hardship stories-card-hardship--${getHardshipTag(entry)}`}>
                    {HARDSHIP_TAG_LABELS[getHardshipTag(entry)]}
                  </span>
                  <span className="stories-card-title">{entry.title}</span>
                  <span className="stories-card-footer">
                    <span className="stories-card-arrow" aria-hidden="true">Read story →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showFeatured && latestStories.length > 0 && (
        <section className="stories-latest" aria-label="Latest stories">
          <h2 className="stories-latest-title">Latest stories</h2>
          <ul className="stories-grid stories-grid--latest" role="list">
            {latestStories.map((entry) => (
              <li key={entry.slug} className="stories-card-wrap">
                <Link
                  href={`/stories/${entry.slug}`}
                  className={`stories-card stories-card--${entry.category}`}
                >
                  <span className="stories-card-meta">
                    <span className="stories-card-icon" aria-hidden="true">
                      {SCAM_CATEGORY_ICONS[entry.category]}
                    </span>
                    <span className="stories-card-category">
                      {SCAM_CATEGORY_LABELS[entry.category]}
                    </span>
                  </span>
                  <span className={`stories-card-hardship stories-card-hardship--${getHardshipTag(entry)}`}>
                    {HARDSHIP_TAG_LABELS[getHardshipTag(entry)]}
                  </span>
                  <span className="stories-card-title">{entry.title}</span>
                  <span className="stories-card-footer">
                    <span className="stories-card-arrow" aria-hidden="true">Read story →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="stories-feed-link-wrap">
            <a href="/stories/feed" className="stories-feed-link" type="application/rss+xml">
              Subscribe to new stories (RSS)
            </a>
          </p>
        </section>
      )}

      {showFeatured && (featuredStories.length > 0 || latestStories.length > 0) && (
        <h2 className="stories-more-title">More stories</h2>
      )}

      <ul className="stories-grid" role="list">
        {filteredStories.map((entry) => (
          <li key={entry.slug} className="stories-card-wrap">
            <Link
              href={`/stories/${entry.slug}`}
              className={`stories-card stories-card--${entry.category}`}
            >
              <span className="stories-card-meta">
                <span className="stories-card-icon" aria-hidden="true">
                  {SCAM_CATEGORY_ICONS[entry.category]}
                </span>
                <span className="stories-card-category">
                  {SCAM_CATEGORY_LABELS[entry.category]}
                </span>
              </span>
              <span className={`stories-card-hardship stories-card-hardship--${getHardshipTag(entry)}`}>
                {HARDSHIP_TAG_LABELS[getHardshipTag(entry)]}
              </span>
              <span className="stories-card-title">{entry.title}</span>
              <span className="stories-card-footer">
                <span className="stories-card-arrow" aria-hidden="true">Read story →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="stories-cta-block">
        <p className="stories-cta-text">Been targeted? Your story can help others.</p>
        <Link href="/report/" className="stories-cta-link">
          Report your experience
        </Link>
        <p className="stories-cta-text stories-cta-books">
          Want to learn more? See our <Link href="/tools/books/" className="stories-cta-inline-link">recommended books &amp; resources</Link> on financial literacy and fraud awareness.
        </p>
      </div>

      <p className="stories-back-to-top-inline-wrap">
        <button
          type="button"
          onClick={scrollToTop}
          className="stories-back-to-top-inline"
          aria-label="Back to top of page"
        >
          <ChevronUpIcon className="stories-back-to-top-inline-icon" />
        </button>
      </p>
    </div>
  );
}
