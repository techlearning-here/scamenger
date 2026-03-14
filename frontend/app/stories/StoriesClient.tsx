'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SCAM_STORY_ENTRIES } from '@/data/scam-stories';
import { SCAM_CATEGORY_ICONS } from '@/data/scams/icons';
import { SCAM_CATEGORY_LABELS, type ScamCategoryId } from '@/data/scams/types';

const ALL_CATEGORIES = 'all';

type SortOption = 'default' | 'title' | 'category';

/**
 * Client component: scam story cards with category filter (pills + select fallback).
 * Each card links to /stories/[slug]; story content can be added incrementally.
 */
export function StoriesClient() {
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const filteredStories = useMemo(() => {
    let list = categoryFilter === ALL_CATEGORIES
      ? [...SCAM_STORY_ENTRIES]
      : SCAM_STORY_ENTRIES.filter((s) => s.category === categoryFilter);
    if (sortBy === 'title') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
    } else if (sortBy === 'category') {
      list = [...list].sort((a, b) => {
        const catCmp = SCAM_CATEGORY_LABELS[a.category].localeCompare(SCAM_CATEGORY_LABELS[b.category], undefined, { sensitivity: 'base' });
        return catCmp !== 0 ? catCmp : a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
      });
    }
    return list;
  }, [categoryFilter, sortBy]);

  const categoryOptions = useMemo(() => {
    const seen = new Set<ScamCategoryId>();
    SCAM_STORY_ENTRIES.forEach((s) => seen.add(s.category));
    return Array.from(seen).sort((a, b) =>
      SCAM_CATEGORY_LABELS[a].localeCompare(SCAM_CATEGORY_LABELS[b])
    );
  }, []);

  return (
    <div className="stories-page-content">
      <div className="stories-toolbar">
        <p className="stories-count" aria-live="polite">
          <span className="stories-count-num">{filteredStories.length}</span>
          {' '}{filteredStories.length === 1 ? 'story' : 'stories'}
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
            <option value="title">Title A–Z</option>
            <option value="category">Category then title</option>
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
      </div>

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
      </div>
    </div>
  );
}
