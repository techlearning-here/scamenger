'use client';

import { useState } from 'react';

export interface FlashCard {
  question: string; // "True or false?\n\n\"statement text\""
  answer: string;   // "True — explanation text"
}

interface Props {
  cards: FlashCard[];
}

/** Splits "True or false?\n\nstatement" into label + statement. */
function parseQuestion(raw: string): { label: string; statement: string } {
  const idx = raw.indexOf('\n\n');
  if (idx === -1) return { label: '', statement: raw };
  return {
    label: raw.slice(0, idx),
    statement: raw.slice(idx + 2).replace(/^"|"$/g, ''),
  };
}

/** Splits "True — explanation" into verdict + explanation. */
function parseAnswer(raw: string): { verdict: string; explanation: string } {
  const idx = raw.indexOf(' \u2014 ');
  if (idx === -1) return { verdict: raw, explanation: '' };
  return {
    verdict: raw.slice(0, idx),
    explanation: raw.slice(idx + 3),
  };
}

export function FlashCards({ cards }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [got, setGot] = useState(0);
  const [assessed, setAssessed] = useState(0);
  const [done, setDone] = useState(false);

  if (cards.length === 0) return null;

  function handleFlip() {
    if (!flipped) setFlipped(true);
  }

  function handleAssess(correct: boolean) {
    const newAssessed = assessed + 1;
    const newGot = got + (correct ? 1 : 0);
    if (newAssessed === cards.length) {
      setGot(newGot);
      setAssessed(newAssessed);
      setDone(true);
    } else {
      setGot(newGot);
      setAssessed(newAssessed);
      setIndex(index + 1);
      setFlipped(false);
    }
  }

  function handleRetry() {
    setIndex(0);
    setFlipped(false);
    setGot(0);
    setAssessed(0);
    setDone(false);
  }

  if (done) {
    const perfect = got === cards.length;
    return (
      <section className="flashcards-section" aria-label="Test your understanding">
        <header className="flashcards-header">
          <h2 className="flashcards-title">Test your understanding</h2>
        </header>
        <div className="flashcards-results">
          <div className="flashcards-score-ring" aria-hidden="true">
            <span className="flashcards-score-num">{got}</span>
            <span className="flashcards-score-denom">/{cards.length}</span>
          </div>
          <p className="flashcards-score-label">
            {perfect ? 'Perfect score' : `${cards.length - got} to review`}
          </p>
          <p className={`flashcards-outcome${perfect ? ' flashcards-outcome--perfect' : ' flashcards-outcome--retry'}`}>
            {perfect
              ? 'You know exactly what to watch for. Stay sharp.'
              : 'Re-read the story above, then try again.'}
          </p>
          <button className="flashcards-retry-btn" onClick={handleRetry}>
            Try again
          </button>
        </div>
      </section>
    );
  }

  const card = cards[index];
  const { label, statement } = parseQuestion(card.question);
  const { verdict, explanation } = parseAnswer(card.answer);

  return (
    <section className="flashcards-section" aria-label="Test your understanding">
      <header className="flashcards-header">
        <h2 className="flashcards-title">Test your understanding</h2>
        <p className="flashcards-subtitle">Flip each card to check your answer</p>
      </header>

      <div className="flashcards-dots" aria-hidden="true">
        {cards.map((_, i) => (
          <span
            key={i}
            className={`flashcards-dot${
              i === index ? ' flashcards-dot--active' : i < index ? ' flashcards-dot--done' : ''
            }`}
          />
        ))}
      </div>

      <div
        className="flashcard-scene"
        onClick={handleFlip}
        role="button"
        aria-label={flipped ? 'Card showing answer' : 'Click to reveal answer'}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
      >
        <div className={`flashcard${flipped ? ' flashcard--flipped' : ''}`}>

          <div className="flashcard__face flashcard__front">
            {label && <span className="flashcard__label">{label}</span>}
            <p className="flashcard__statement">{statement}</p>
            <span className="flashcard__hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              Tap to flip
            </span>
          </div>

          <div className="flashcard__face flashcard__back">
            <span className="flashcard__verdict">{verdict}</span>
            {explanation && <p className="flashcard__explanation">{explanation}</p>}
          </div>

        </div>
      </div>

      {flipped && (
        <div className="flashcards-assess" role="group" aria-label="Self assessment">
          <button className="flashcards-btn flashcards-btn--got" onClick={() => handleAssess(true)}>
            Got it
          </button>
          <button className="flashcards-btn flashcards-btn--missed" onClick={() => handleAssess(false)}>
            Missed it
          </button>
        </div>
      )}
    </section>
  );
}
