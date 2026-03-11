'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AdminReportDto } from '@/data/admin/api';
import { REPORT_TYPE_LABELS, REPORT_TYPE_ICONS, LOST_MONEY_RANGE_LABELS } from '@/data/reports/api';
import { COUNTRY_OPTIONS } from '@/data/reports/countries';
import { SCAM_CATEGORY_LABELS } from '@/data/scams/types';

const REPORT_TYPE_LABELS_MAP = REPORT_TYPE_LABELS as Record<string, string>;
const X_MAX_TWEET_LENGTH = 280;

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
    'New scam report.',
    `${typeIcon} ${typeLabel}.`,
    originCountryLabel ? `Origin: ${originCountryLabel}.` : null,
    categoryLabel ? `Category: ${categoryLabel}.` : null,
    lostMoneyLine,
    `Report ID: ${report.id}`,
    'View full report on Scamenger.',
  ].filter(Boolean);
  const text = lines.join(' ');
  return text.length > X_MAX_TWEET_LENGTH ? text.slice(0, X_MAX_TWEET_LENGTH - 3) + '…' : text;
}

export interface XShareModalProps {
  report: AdminReportDto;
  onClose: () => void;
}

export function XShareModal({ report, onClose }: XShareModalProps) {
  const [postText, setPostText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPostText(buildDefaultPostText(report));
  }, [report.id, report.report_type, report.country_origin, report.category, report.lost_money, report.lost_money_range]);

  const handleCopy = useCallback(() => {
    if (!postText.trim()) return;
    navigator.clipboard.writeText(postText.trim()).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, [postText]);

  const handleOpenX = useCallback(() => {
    const text = postText.trim().slice(0, X_MAX_TWEET_LENGTH);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, 'x-share', 'width=550,height=420');
  }, [postText]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const length = postText.length;
  const overLimit = length > X_MAX_TWEET_LENGTH;

  return (
    <div
      className="admin-x-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-x-modal-title"
    >
      <div className="admin-x-modal">
        <div className="admin-x-modal-header">
          <h2 id="admin-x-modal-title" className="admin-x-modal-title">
            Share to X (anonymized)
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="admin-x-modal-close"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="admin-x-modal-intro">
          Edit the post below to keep it anonymized. X has a 280-character limit. People can visit the Scamenger website and enter the report ID to view the full report.
        </p>
        <p className="admin-x-report-id">
          <strong>Report ID:</strong> <code className="admin-x-report-id-code">{report.id}</code>
        </p>
        <div className="admin-x-form-group">
          <label htmlFor="admin-x-post-text" className="admin-x-label">
            Post text <span className="admin-x-char-count" aria-live="polite">{length}/{X_MAX_TWEET_LENGTH}</span>
          </label>
          <textarea
            id="admin-x-post-text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={4}
            maxLength={X_MAX_TWEET_LENGTH + 100}
            className={`form-control form-control-textarea admin-x-textarea ${overLimit ? 'admin-x-textarea-over' : ''}`}
            placeholder="Anonymized summary for X (max 280 chars)…"
          />
          {overLimit && (
            <p className="admin-x-over-limit" role="alert">
              Over 280 characters. Only the first 280 will be used when posting.
            </p>
          )}
        </div>
        <div className="admin-x-actions">
          <button
            type="button"
            onClick={() => setShowPreview((p) => !p)}
            className="admin-x-btn admin-x-btn-secondary"
          >
            {showPreview ? 'Hide preview' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!postText.trim()}
            className="admin-x-btn admin-x-btn-secondary"
          >
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>
          <button
            type="button"
            onClick={handleOpenX}
            disabled={!postText.trim()}
            className="admin-x-btn admin-x-btn-primary"
          >
            Post on X
          </button>
        </div>
        {showPreview && (
          <div className="admin-x-preview-wrap">
            <p className="admin-x-preview-label">Preview (how it may look on X)</p>
            <div className="admin-x-preview-card">
              <div className="admin-x-preview-body">
                {postText.trim() || 'Post text will appear here.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
