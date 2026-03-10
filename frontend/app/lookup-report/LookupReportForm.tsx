'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getReportById } from '@/data/reports/api';

/**
 * Lookup form: fetches report by ID and only navigates to report page when found.
 */
export function LookupReportForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      const form = e.currentTarget;
      const id = (form.querySelector('[name="id"]') as HTMLInputElement)?.value?.trim();
      if (!id) {
        setError('Please enter a report ID.');
        return;
      }
      setLoading(true);
      getReportById(id)
        .then((data) => {
          if (data == null) {
            setError('No report found with this ID. Please check the ID and try again.');
            setLoading(false);
            return;
          }
          const params = new URLSearchParams({ id });
          if ('submitter_view_token' in data && data.submitter_view_token) {
            params.set('view_token', data.submitter_view_token);
          }
          router.push(`/reports/?${params.toString()}`);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
          setLoading(false);
        });
    },
    [router],
  );

  return (
    <>
      {error && (
        <p id="report-id-search-error" className="report-scam-error" role="alert">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="report-id-search-form">
        <label htmlFor="report-id-search-input" className="report-id-search-label">
          Report ID
        </label>
        <input
          id="report-id-search-input"
          type="text"
          name="id"
          placeholder="e.g. ecfb0b4a-3398-433a-8a36-d1d519d6f4f7"
          className="form-control report-id-search-input"
          autoComplete="off"
          disabled={loading}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'report-id-search-error' : undefined}
        />
        <button
          type="submit"
          className="report-id-search-submit"
          disabled={loading}
        >
          {loading ? 'Looking up…' : 'View report'}
        </button>
      </form>
    </>
  );
}
