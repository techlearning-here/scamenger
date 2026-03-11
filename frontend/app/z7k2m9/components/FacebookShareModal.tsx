'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AdminReportDto } from '@/data/admin/api';
import { getFacebookStatus, postReportToFacebook } from '@/data/admin/api';
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
  token: string;
  onClose: () => void;
}

export function FacebookShareModal({ report, token, onClose }: FacebookShareModalProps) {
  const [postText, setPostText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fbEnabled, setFbEnabled] = useState<boolean | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postResult, setPostResult] = useState<{ post_id: string; permalink: string } | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  useEffect(() => {
    getFacebookStatus(token)
      .then((res) => setFbEnabled(res.enabled))
      .catch(() => setFbEnabled(false));
  }, [token]);

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

  const handlePostToFacebook = useCallback(() => {
    if (!postText.trim() || postLoading) return;
    setPostLoading(true);
    setPostError(null);
    setPostResult(null);
    postReportToFacebook(report.id, token, postText.trim())
      .then((res) => {
        setPostResult(res);
        setPostError(null);
      })
      .catch((err) => {
        setPostError(err instanceof Error ? err.message : 'Post failed');
        setPostResult(null);
      })
      .finally(() => setPostLoading(false));
  }, [report.id, token, postText, postLoading]);

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
          {fbEnabled === true && (
            <button
              type="button"
              onClick={handlePostToFacebook}
              disabled={!postText.trim() || postLoading}
              className="admin-fb-btn admin-fb-btn-primary"
            >
              {postLoading ? 'Posting…' : 'Post to Facebook'}
            </button>
          )}
          {fbEnabled !== true && (
            <button
              type="button"
              onClick={handleOpenFacebook}
              className="admin-fb-btn admin-fb-btn-primary"
            >
              Open Facebook to share
            </button>
          )}
        </div>
        {fbEnabled === false && (
          <p className="admin-fb-not-configured" role="status">
            Facebook posting is not configured. Set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN in the backend to post directly.
          </p>
        )}
        {postError && (
          <p className="admin-fb-error" role="alert">
            {postError}
          </p>
        )}
        {postResult && (
          <p className="admin-fb-success" role="status">
            Posted. <a href={postResult.permalink} target="_blank" rel="noopener noreferrer">View on Facebook</a>
          </p>
        )}
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
