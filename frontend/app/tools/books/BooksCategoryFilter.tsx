'use client';

import { useState } from 'react';
import { getCategoryLabel, type BookCategory } from '@/data/books';

interface BooksCategoryFilterProps {
  categoryOrder: BookCategory[];
  children: React.ReactNode;
}

/**
 * Tabs to filter the books list by category. Uses data-books-filter and data-category for CSS visibility.
 */
export function BooksCategoryFilter({ categoryOrder, children }: BooksCategoryFilterProps) {
  const [filter, setFilter] = useState<'all' | BookCategory>('all');

  return (
    <div data-books-filter={filter} className="tool-books-filter-wrap">
      <nav className="tool-books-filter-nav" aria-label="Filter books by category">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`tool-books-filter-btn ${filter === 'all' ? 'tool-books-filter-btn--active' : ''}`}
          aria-pressed={filter === 'all'}
        >
          All
        </button>
        {categoryOrder.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`tool-books-filter-btn ${filter === cat ? 'tool-books-filter-btn--active' : ''}`}
            aria-pressed={filter === cat}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </nav>
      {children}
    </div>
  );
}
