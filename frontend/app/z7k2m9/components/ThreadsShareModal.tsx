'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AdminReportDto } from '@/data/admin/api';
import { getThreadsStatus, postReportToThreads } from '@/data/admin/api';
import { REPORT_TYPE_LABELS, REPORT_TYPE_ICONS, LOST_MONEY_RANGE_LABELS } from '@/data/reports/api';
import { COUNTRY_OPTIONS } from '@/data/reports/countries';
import { SCAM_CATEGORY_LABELS } from '@/data/scams/types';

const REPORT_TYPE_LABELS_MAP = REPORT_TYPE_LABELS as Record<string, string>;
const THREADS_MAX_LENGTH = 500;

function buildDefaultPostText(report: AdminReportDto): string {
  const typeLabel = REPORT_TYPE_LABELS_MAP[report.report_type] ?? report.report_type;
  const typeIcon = (REPORT_TYPE_ICONS as Record<string, string>)[report.report_type] ?? '📋';
  const categoryLabel = report.category
    ? (SCAM_CATEGORY_LABELS[report.category as keyof typeof SCAM_CATEGORY_LABELS] ?? report.category)
    : null;
  const originCountryLabel = report.country_origin
    ? (COUNTRY_OPTIONS.find((o) => o.value === report.country_origin)?.label ?? report.country_origin)
    : null;
  const lostMoneyLine = report.lost_money
    ? (report.lost_money_range && report.lost_money_range !== 'none'
        ? `Lost money: ${(LOST_MONEY_RANGE_LABELS as Record<string, string>)[report.lost_money_range] ?? report.lost_money_range}`
        : 'Lost money: Yes')
    : null;
  const lines = [
    'We have received a new scam report.',
    `Type: ${typeIcon} ${typeLabel}.`,
    originCountryLabel ? `Origin Country: ${originCountryLabel}.` : null,
    categoryLabel ? `Category: ${categoryLabel}.` : null,
    lostMoneyLine,
    `Report ID: ${report.id}`,
    'Visit the Scamenger website and input the report ID to view the full report.',
  ].filter(Boolean);
  const full = lines.join('\n');
  return full.length > THREADS_MAX_LENGTH ? full.slice(0, THREADS_MAX_LENGTH - 3) + '...' : full;
}

export interface ThreadsShareModalProps {
  report: AdminReportDto;
  token: string;
  onClose: () => void;
  onPostedToThreads?: () => void;
}

export function ThreadsShareModal({ report, token, onClose, onPostedToThreads }: ThreadsShareModalProps) {
  const [postText, setPostText] = useState('');
  const [threadsEnabled, setThreadsEnabled] = useState<boolean | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postResult, setPostResult] = useState<{ post_id: string; permalink: string } | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  useEffect(() => {
    getThreadsStatus(token)
      .then((res) => setThreadsEnabled(res.enabled))
      .catch(() => setThreadsEnabled(false));
  }, [token]);

  useEffect(() => {
    setPostText(buildDefaultPostText(report));
  }, [report.id, report.report_type, report.country_origin, report.category, report.lost_money, report.lost_money_range]);

  const handlePostToThreads = useCallback(() => {
    const text = postText.trim().slice(0, THREADS_MAX_LENGTH);
    if (!text || postLoading) return;
    setPostLoading(true);
    setPostError(null);
    setPostResult(null);
    postReportToThreads(report.id, token, text)
      .then((res) => {
        setPostResult(res);
        setPostError(null);
        onPostedToThreads?.();
      })
      .catch((err) => {
        setPostError(err instanceof Error ? err.message : 'Post failed');
        setPostResult(null);
      })
      .finally(() => setPostLoading(false));
  }, [report.id, token, postText, postLoading, onPostedToThreads]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const length = postText.length;
  const overLimit = length > THREADS_MAX_LENGTH;

  return (
    <div
      className="admin-fb-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-threads-modal-title"
    >
      <div className="admin-fb-modal">
        <div className="admin-fb-modal-header">
          <h2 id="admin-threads-modal-title" className="admin-fb-modal-title">
            Share to Threads (anonymized)
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="admin-fb-modal-close"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="admin-fb-modal-intro">
          Edit the post below to keep it anonymized. Threads posts are limited to {THREADS_MAX_LENGTH} characters. People can visit the Scamenger website and enter the report ID to view the full report.
        </p>
        <p className="admin-fb-report-id">
          <strong>Report ID:</strong> <code className="admin-fb-report-id-code">{report.id}</code>
        </p>
        <div className="admin-fb-form-group">
          <label htmlFor="admin-threads-post-text" className="admin-fb-label">
            Post text ({length}/{THREADS_MAX_LENGTH})
          </label>
          <textarea
            id="admin-threads-post-text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={6}
            className="form-control form-control-textarea admin-fb-textarea"
            placeholder="Anonymized summary for Threads…"
            maxLength={THREADS_MAX_LENGTH + 100}
          />
          {overLimit && (
            <p className="admin-fb-error" role="status">
              Text will be truncated to {THREADS_MAX_LENGTH} characters when posting.
            </p>
          )}
        </div>
        <div className="admin-fb-actions">
          {threadsEnabled === true && (
            <button
              type="button"
              onClick={handlePostToThreads}
              disabled={!postText.trim() || postLoading}
              className="admin-fb-btn admin-fb-btn-primary"
            >
              {postLoading ? 'Posting…' : 'Post to Threads'}
            </button>
          )}
          {threadsEnabled === false && (
            <p className="admin-fb-not-configured" role="status">
              Threads posting is not configured. Set THREADS_USER_ID and THREADS_ACCESS_TOKEN in the backend to post directly.
            </p>
          )}
        </div>
        {postError && (
          <p className="admin-fb-error" role="alert">
            {postError}
          </p>
        )}
        {postResult && (
          <p className="admin-fb-success" role="status">
            Posted.{' '}
            {postResult.permalink && (
              <a href={postResult.permalink} target="_blank" rel="noopener noreferrer">
                View on Threads
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
