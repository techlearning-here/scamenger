'use client';

import { useState, useEffect } from 'react';

const QUOTES = [
  'Everything is a story until you experience it.',
  "It's just a story—until it happens to you.",
  "Every scam is someone's story. Until it's yours.",
  "Stories stay abstract until they become real.",
  "It's only a story until you're in it.",
];

/** Default quote used for SSR and initial client render so hydration matches. */
const DEFAULT_QUOTE = QUOTES[0];

/**
 * Shows one quote; same on server and first client render. After hydration, may switch to a random quote and fade in.
 */
export function StoriesQuote() {
  const [quote, setQuote] = useState(DEFAULT_QUOTE);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <p
      className={`stories-intro-quote ${visible ? 'stories-intro-quote--visible' : ''}`}
      aria-live="polite"
    >
      {quote}
    </p>
  );
}
