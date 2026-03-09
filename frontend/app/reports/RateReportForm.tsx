'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitRating, type RatePayloadDto, type ReportResponseDto } from '@/data/reports/api';
import { supabase } from '@/lib/supabase';

const RATING_LABELS: Record<keyof RatePayloadDto, string> = {
  credibility: 'Credibility',
  usefulness: 'Usefulness',
  completeness: 'Completeness',
  relevance: 'Relevance',
};

interface RateReportFormProps {
  reportId: string;
  onRated: (report: ReportResponseDto) => void;
}

export function RateReportForm({ reportId, onRated }: RateReportFormProps) {
  const [credibility, setCredibility] = useState(3);
  const [usefulness, setUsefulness] = useState(3);
  const [completeness, setCompleteness] = useState(3);
  const [relevance, setRelevance] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError('You have already rated this report.');
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
        {(Object.keys(RATING_LABELS) as (keyof RatePayloadDto)[]).map((key) => (
          <div key={key} className="rate-report-field">
            <label htmlFor={`rate-${key}`}>{RATING_LABELS[key]}</label>
            <select
              id={`rate-${key}`}
              value={key === 'credibility' ? credibility : key === 'usefulness' ? usefulness : key === 'completeness' ? completeness : relevance}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (key === 'credibility') setCredibility(v);
                else if (key === 'usefulness') setUsefulness(v);
                else if (key === 'completeness') setCompleteness(v);
                else setRelevance(v);
              }}
              disabled={submitting}
              className="rate-report-select"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        ))}
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
        {submitting ? 'Submitting…' : 'Submit rating'}
      </button>
    </form>
  );
}
