'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AdminReportDto } from '@/data/admin/api';
import { REPORT_TYPE_LABELS, REPORT_TYPE_ICONS, LOST_MONEY_RANGE_LABELS } from '@/data/reports/api';
import { COUNTRY_OPTIONS } from '@/data/reports/countries';
import { SCAM_CATEGORY_LABELS } from '@/data/scams/types';

const REPORT_TYPE_LABELS_MAP = REPORT_TYPE_LABELS as Record<string, string>;

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
  return lines.join('\n');
}

export interface FacebookShareModalProps {
  report: AdminReportDto;
  onClose: () => void;
}

export function FacebookShareModal({ report, onClose }: FacebookShareModalProps) {
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

  const handleOpenFacebook = useCallback(() => {
    window.open('https://www.facebook.com/', 'facebook-share', 'width=600,height=400');
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="admin-fb-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-fb-modal-title"
    >
      <div className="admin-fb-modal">
        <div className="admin-fb-modal-header">
          <h2 id="admin-fb-modal-title" className="admin-fb-modal-title">
            Share to Facebook (anonymized)
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
          Edit the post below to keep it anonymized. We use the report ID instead of a link so Facebook is happy. People can visit the Scamenger website and input the report ID to view the full report.
        </p>
        <p className="admin-fb-report-id">
          <strong>Report ID:</strong> <code className="admin-fb-report-id-code">{report.id}</code>
        </p>
        <div className="admin-fb-form-group">
          <label htmlFor="admin-fb-post-text" className="admin-fb-label">
            Post text
          </label>
          <textarea
            id="admin-fb-post-text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={6}
            className="form-control form-control-textarea admin-fb-textarea"
            placeholder="Anonymized summary for the Facebook post…"
          />
        </div>
        <div className="admin-fb-actions">
          <button
            type="button"
            onClick={() => setShowPreview((p) => !p)}
            className="admin-fb-btn admin-fb-btn-secondary"
          >
            {showPreview ? 'Hide preview' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!postText.trim()}
            className="admin-fb-btn admin-fb-btn-secondary"
          >
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>
          <button
            type="button"
            onClick={handleOpenFacebook}
            className="admin-fb-btn admin-fb-btn-primary"
          >
            Open Facebook to share
          </button>
        </div>
        {showPreview && (
          <div className="admin-fb-preview-wrap">
            <p className="admin-fb-preview-label">Preview (how it may look on Facebook)</p>
            <div className="admin-fb-preview-card">
              <div className="admin-fb-preview-header">
                <div className="admin-fb-preview-avatar" aria-hidden="true" />
                <div>
                  <strong className="admin-fb-preview-page-name">Scam Avenger</strong>
                  <span className="admin-fb-preview-meta"> · Follow</span>
                </div>
              </div>
              <div className="admin-fb-preview-body">
                {postText.trim() || 'Post text will appear here.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
