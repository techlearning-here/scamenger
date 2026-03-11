'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getReportHelpful,
  submitHelpfulVote,
  type HelpfulCountsResponse,
} from '@/data/reports/api';
import { supabase } from '@/lib/supabase';

export interface DidThisHelpVoteProps {
  reportId: string;
  /** Only show for approved reports; caller can hide when status is pending. */
  visible?: boolean;
}

/**
 * "Did this help?" voting: Yes / No with counts. Authenticated users can vote once per report.
 */
export function DidThisHelpVote({ reportId, visible = true }: DidThisHelpVoteProps) {
  const [data, setData] = useState<HelpfulCountsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<'yes' | 'no' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    if (!reportId) return;
    setError(null);
    try {
      const session = supabase ? (await supabase.auth.getSession()).data?.session : null;
      const token = session?.access_token ?? null;
      const result = await getReportHelpful(reportId, token);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    if (!visible || !reportId) {
      setLoading(false);
      setData(null);
      return;
    }
    setLoading(true);
    fetchCounts();
  }, [visible, reportId, fetchCounts]);

  const handleVote = useCallback(
    async (helpful: boolean) => {
      if (!reportId) return;
      const session = supabase ? (await supabase.auth.getSession()).data?.session : null;
      const token = session?.access_token;
      if (!token) {
        setError('Sign in to vote.');
        return;
      }
      setError(null);
      setVoting(helpful ? 'yes' : 'no');
      try {
        const result = await submitHelpfulVote(reportId, helpful, token);
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Vote failed');
        if (e instanceof Error && (e.message.includes('401') || e.message.includes('Sign in'))) {
          setError('Sign in to vote.');
        }
      } finally {
        setVoting(null);
      }
    },
    [reportId],
  );

  if (!visible) return null;
  if (loading && !data) {
    return (
      <section className="report-detail-helpful" aria-label="Did this help?">
        <p className="report-detail-helpful-loading">Loading…</p>
      </section>
    );
  }
  if (error && !data) {
    return (
      <section className="report-detail-helpful" aria-label="Did this help?">
        <p className="report-detail-helpful-error" role="alert">
          {error}
        </p>
      </section>
    );
  }

  const helpfulCount = data?.helpful_count ?? 0;
  const notHelpfulCount = data?.not_helpful_count ?? 0;
  const userVote = data?.user_vote;

  return (
    <section className="report-detail-helpful" aria-label="Did this help?">
      <h2 className="report-detail-helpful-heading">Did this help?</h2>
      <div className="report-detail-helpful-actions">
        <button
          type="button"
          onClick={() => handleVote(true)}
          disabled={voting !== null}
          className={`report-detail-helpful-btn report-detail-helpful-btn-yes ${userVote === true ? 'is-selected' : ''}`}
          aria-pressed={userVote === true}
          aria-label={`Yes, it helped (${helpfulCount} votes)`}
        >
          <span className="report-detail-helpful-btn-icon" aria-hidden="true">
            👍
          </span>
          <span className="report-detail-helpful-btn-label">Yes</span>
          {helpfulCount > 0 && (
            <span className="report-detail-helpful-btn-count">{helpfulCount}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleVote(false)}
          disabled={voting !== null}
          className={`report-detail-helpful-btn report-detail-helpful-btn-no ${userVote === false ? 'is-selected' : ''}`}
          aria-pressed={userVote === false}
          aria-label={`No (${notHelpfulCount} votes)`}
        >
          <span className="report-detail-helpful-btn-icon" aria-hidden="true">
            👎
          </span>
          <span className="report-detail-helpful-btn-label">No</span>
          {notHelpfulCount > 0 && (
            <span className="report-detail-helpful-btn-count">{notHelpfulCount}</span>
          )}
        </button>
      </div>
      {error && (
        <p className="report-detail-helpful-error" role="alert">
          {error}
          {error.includes('Sign in') && (
            <>
              {' '}
              <Link href="/login/">Sign in</Link>
            </>
          )}
        </p>
      )}
    </section>
  );
}
