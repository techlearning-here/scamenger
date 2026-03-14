'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BookCoverProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Book cover image with fallback: uses next/image when possible and shows placeholder on error.
 */
export function BookCover({ src, alt = '', width = 80, height = 120, className = '' }: BookCoverProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <span className="tool-books-card-cover-fallback" aria-hidden>
        <span>📖</span>
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
