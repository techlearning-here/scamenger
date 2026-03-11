'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { submitRating, type RatePayloadDto, type ReportResponseDto } from '@/data/reports/api';
import { supabase } from '@/lib/supabase';

const RATING_LABELS: Record<keyof RatePayloadDto, string> = {
  credibility: 'Credibility',
  usefulness: 'Usefulness',
  completeness: 'Completeness',
  relevance: 'Relevance',
};

const MAX_STARS = 5;

interface StarRowProps {
  label: string;
  id: string;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}

function StarRow({ label, id, value, onChange, disabled }: StarRowProps) {
  return (
    <div className="rate-report-field">
      <span className="rate-report-field-label" id={`${id}-label`}>
        {label}
      </span>
      <div
        className="rate-report-stars"
        role="group"
        aria-labelledby={`${id}-label`}
        aria-valuenow={value}
        aria-valuemin={1}
        aria-valuemax={MAX_STARS}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`rate-report-star ${value >= star ? 'rate-report-star-filled' : ''}`}
            onClick={() => onChange(star)}
            disabled={disabled}
            aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
            aria-pressed={value >= star}
          >
            {value >= star ? '★' : '☆'}
          </button>
        ))}
      </div>
    </div>
  );
}

interface RateReportFormProps {
  reportId: string;
  onRated: (report: ReportResponseDto) => void;
  /** When present, form is pre-filled and submit updates the rating. */
  initialRating?: RatePayloadDto | null;
}

export function RateReportForm({ reportId, onRated, initialRating }: RateReportFormProps) {
  const [credibility, setCredibility] = useState(initialRating?.credibility ?? 3);
  const [usefulness, setUsefulness] = useState(initialRating?.usefulness ?? 3);
  const [completeness, setCompleteness] = useState(initialRating?.completeness ?? 3);
  const [relevance, setRelevance] = useState(initialRating?.relevance ?? 3);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRating) {
      setCredibility(initialRating.credibility);
      setUsefulness(initialRating.usefulness);
      setCompleteness(initialRating.completeness);
      setRelevance(initialRating.relevance);
    }
  }, [initialRating]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const session = supabase ? (await supabase.auth.getSession()).data?.session : null;
      const token = session?.access_token;
      if (!token) {
        setError('Sign in to rate this report.');
        setSubmitting(false);
        return;
      }
      const report = await submitRating(
        reportId,
        { credibility, usefulness, completeness, relevance },
        token,
      );
      onRated(report);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit rating';
      if (message.includes('401') || message.includes('invalid') || message.includes('token')) {
        setError('Sign in to rate this report.');
      } else if (message.includes('409') || message.includes('already rated')) {
        setError('You have already rated this report and it cannot be changed.');
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rate-report-form">
      <h3 className="rate-report-heading">Rate this report</h3>
      <p className="rate-report-intro">1 = low, 5 = high. Sign in to submit.</p>
      <div className="rate-report-fields">
        <StarRow
          label={RATING_LABELS.credibility}
          id="rate-credibility"
          value={credibility}
          onChange={setCredibility}
          disabled={submitting}
        />
        <StarRow
          label={RATING_LABELS.usefulness}
          id="rate-usefulness"
          value={usefulness}
          onChange={setUsefulness}
          disabled={submitting}
        />
        <StarRow
          label={RATING_LABELS.completeness}
          id="rate-completeness"
          value={completeness}
          onChange={setCompleteness}
          disabled={submitting}
        />
        <StarRow
          label={RATING_LABELS.relevance}
          id="rate-relevance"
          value={relevance}
          onChange={setRelevance}
          disabled={submitting}
        />
      </div>
      {error && (
        <p className="rate-report-error" role="alert">
          {error}
          {error.includes('Sign in') && (
            <> <Link href="/login/">Sign in</Link></>
          )}
        </p>
      )}
      <button type="submit" disabled={submitting} className="rate-report-submit">
        {submitting ? 'Submitting…' : initialRating ? 'Update rating' : 'Submit rating'}
      </button>
    </form>
  );
}
