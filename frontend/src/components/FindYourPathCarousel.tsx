'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';

export interface FindYourPathLink {
  label: string;
  href: string;
}

export interface FindYourPathSlide {
  id: string;
  icon: string;
  title: string;
  desc: string;
  links: FindYourPathLink[];
}

const DEFAULT_AUTO_ADVANCE_MS = 5000;

interface FindYourPathCarouselProps {
  slides: FindYourPathSlide[];
  /** Auto-advance interval in ms; set to 0 to disable. Default 5000. */
  autoAdvanceMs?: number;
}

/** Renders a single slide card (shared by real and cloned slides). */
function SlideCard({ slide }: { slide: FindYourPathSlide }) {
  return (
    <div className="find-your-path-card">
      <span className="find-your-path-icon" aria-hidden="true">
        {slide.icon}
      </span>
      <div className="find-your-path-content">
        <h3 className="find-your-path-title">{slide.title}</h3>
        <p className="find-your-path-desc">{slide.desc}</p>
        <p className="find-your-path-links">
          {slide.links.map((link, i) => (
            <span key={link.href + i}>
              {i > 0 && <span className="find-your-path-sep"> · </span>}
              <Link href={link.href} className="find-your-path-link">
                {link.label}
              </Link>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

/**
 * Carousel for "Find your path" with round-robin (seamless loop): clones first/last
 * slides so next/prev and auto-advance wrap without a visible jump.
 */
export function FindYourPathCarousel({
  slides,
  autoAdvanceMs = DEFAULT_AUTO_ADVANCE_MS,
}: FindYourPathCarouselProps) {
  const count = slides.length;
  const [internalIndex, setInternalIndex] = useState(1);
  const [noTransition, setNoTransition] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  const totalSlides = count + 2;
  const extendedSlides: FindYourPathSlide[] =
    count > 0 ? [slides[count - 1], ...slides, slides[0]] : [];

  const logicalIndex =
    internalIndex === 0
      ? count - 1
      : internalIndex === totalSlides - 1
        ? 0
        : internalIndex - 1;

  const snapTo = useCallback((index: number) => {
    setNoTransition(true);
    setInternalIndex(index);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setNoTransition(false));
    });
  }, []);

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLUListElement>) => {
      if (e.target !== trackRef.current || e.propertyName !== 'transform') return;
      if (internalIndex === 0) snapTo(count);
      else if (internalIndex === totalSlides - 1) snapTo(1);
    },
    [internalIndex, count, totalSlides, snapTo]
  );

  /** Fallback: snap when on a clone in case transitionend doesn't fire (e.g. rapid clicks). */
  useEffect(() => {
    if (count <= 1) return;
    if (internalIndex === 0) {
      const t = setTimeout(() => snapTo(count), 450);
      return () => clearTimeout(t);
    }
    if (internalIndex === totalSlides - 1) {
      const t = setTimeout(() => snapTo(1), 450);
      return () => clearTimeout(t);
    }
  }, [internalIndex, count, totalSlides, snapTo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onFocusIn = () => setIsPaused(true);
    const onFocusOut = (e: FocusEvent) => {
      if (!e.relatedTarget || !el.contains(e.relatedTarget as Node)) {
        setIsPaused(false);
      }
    };
    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);
    return () => {
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, count - 1));
      setInternalIndex(clamped + 1);
    },
    [count]
  );

  const goPrev = useCallback(() => {
    setInternalIndex((i) => Math.max(0, i - 1));
  }, []);
  const goNext = useCallback(() => {
    setInternalIndex((i) => Math.min(totalSlides - 1, i + 1));
  }, [totalSlides]);

  useEffect(() => {
    if (autoAdvanceMs <= 0 || count <= 1) return;
    const id = setInterval(() => {
      if (!isPaused) {
        setInternalIndex((i) => Math.min(totalSlides - 1, i + 1));
      }
    }, autoAdvanceMs);
    return () => clearInterval(id);
  }, [autoAdvanceMs, count, isPaused, totalSlides]);

  if (count === 0) return null;
  if (count === 1) {
    return (
      <div
        ref={containerRef}
        className="find-your-path-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Find your path"
      >
        <div className="find-your-path-viewport">
          <ul
            className="find-your-path-track"
            style={{ height: '100%', ['--total-slides' as string]: 1, transform: 'translateY(0)' }}
          >
            <li className="find-your-path-slide" aria-current="true">
              <SlideCard slide={slides[0]} />
            </li>
          </ul>
        </div>
        <div className="find-your-path-controls">
          <button type="button" className="find-your-path-btn find-your-path-btn-prev" disabled aria-label="Previous slide">‹</button>
          <div className="find-your-path-dots" role="tablist" aria-label="Slide navigation">
            <button type="button" role="tab" aria-selected className="find-your-path-dot" data-active="true" />
          </div>
          <button type="button" className="find-your-path-btn find-your-path-btn-next" disabled aria-label="Next slide">›</button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="find-your-path-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Find your path"
      data-snapping={noTransition ? 'true' : undefined}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="find-your-path-row">
        <button
          type="button"
          className="find-your-path-btn find-your-path-btn-prev"
          onClick={goPrev}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <div className="find-your-path-viewport">
          <ul
            ref={trackRef}
            className="find-your-path-track"
            style={{
              ['--total-slides' as string]: totalSlides,
              height: `${totalSlides * 100}%`,
              transform: `translateY(-${(internalIndex / totalSlides) * 100}%)`,
              transition: noTransition ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            aria-live="polite"
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((slide, index) => (
              <li
                key={index === 0 ? `${slide.id}-clone-last` : index === extendedSlides.length - 1 ? `${slide.id}-clone-first` : slide.id}
                className="find-your-path-slide"
                aria-current={index === internalIndex ? 'true' : undefined}
                aria-hidden={index !== internalIndex}
              >
                <SlideCard slide={slide} />
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="find-your-path-btn find-your-path-btn-next"
          onClick={goNext}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <div className="find-your-path-controls">
        <div
          className="find-your-path-dots"
          role="tablist"
          aria-label="Slide navigation"
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={index === logicalIndex}
              aria-label={`Slide ${index + 1}: ${slide.title}`}
              className="find-your-path-dot"
              data-active={index === logicalIndex ? 'true' : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
