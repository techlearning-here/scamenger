'use client';

import { ChevronUpIcon } from '../../stories/StickyIcons';

export function BooksPageBackToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <p className="tool-back-to-top-wrap">
      <button
        type="button"
        onClick={scrollToTop}
        className="tool-back-to-top-inline"
        aria-label="Back to top"
      >
        <ChevronUpIcon className="tool-back-to-top-inline-icon" />
      </button>
    </p>
  );
}
