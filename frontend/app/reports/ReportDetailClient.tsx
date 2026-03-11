'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { getReportById } from '@/data/reports/api';
import { REPORT_TYPE_LABELS, LOST_MONEY_RANGE_LABELS, REPORT_TYPE_DETAIL_SHORT_LABELS, REPORT_TYPE_ICONS, type ReportType } from '@/data/reports/api';
import type { ReportResponseDto, GetReportByIdResponse } from '@/data/reports/api';
import type { LostMoneyRange } from '@/data/reports/api';
import { SCAM_CATEGORY_LABELS } from '@/data/scams/types';
import { DidThisHelpVote } from './DidThisHelpVote';
import { RateReportForm } from './RateReportForm';
import { supabase } from '@/lib/supabase';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function ReportDetailInner() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id') ?? '';
  const viewToken = searchParams.get('view_token') ?? null;
  const [report, setReport] = useState<GetReportByIdResponse | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [fullReportUrl, setFullReportUrl] = useState<string>('');
  const [publicReportUrl, setPublicReportUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && reportId) {
      const origin = window.location.origin;
      setFullReportUrl(viewToken
        ? `${origin}/reports/?id=${encodeURIComponent(reportId)}&view_token=${encodeURIComponent(viewToken)}`
        : `${origin}/reports/?id=${encodeURIComponent(reportId)}`);
      setPublicReportUrl(`${origin}/reports/?id=${encodeURIComponent(reportId)}`);
    }
  }, [reportId, viewToken]);

  useEffect(() => {
    if (!reportId) {
      setReport(null);
      return;
    }
    setError(null);
    let cancelled = false;
    const load = async () => {
      const session = supabase ? (await supabase.auth.getSession()).data?.session : null;
      const token = session?.access_token ?? undefined;
      try {
        const data = await getReportById(reportId, viewToken || undefined, token ?? undefined);
        if (!cancelled) {
          setReport(data ?? null);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load report');
          setReport(null);
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [reportId, viewToken]);

  const handleCopyUrl = useCallback(() => {
    if (!fullReportUrl) return;
    navigator.clipboard.writeText(fullReportUrl).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, [fullReportUrl]);

  const handleCopyPublicUrl = useCallback(() => {
    if (!publicReportUrl) return;
    navigator.clipboard.writeText(publicReportUrl).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, [publicReportUrl]);

  const handleCopyId = useCallback(() => {
    if (!reportId) return;
    navigator.clipboard.writeText(reportId).then(() => {
      setCopiedId(true);
      window.setTimeout(() => setCopiedId(false), 2000);
    });
  }, [reportId]);

  const handleRated = useCallback((updated: ReportResponseDto) => {
    setReport(updated);
  }, []);

  if (!reportId) {
    return (
      <div className="report-detail-not-found">
        <p>Missing report ID. Use the shareable link you received when you submitted the report.</p>
        <Link href="/report/">Report a scam</Link>
      </div>
    );
  }

  if (error && (report === null || report === undefined)) {
    return (
      <div className="report-detail-not-found">
        <p>{error}</p>
        <Link href="/report/">Report a scam</Link>
      </div>
    );
  }

  if (report === undefined) {
    return <div className="report-detail-loading">Loading report…</div>;
  }

  if (report === null) {
    return (
      <div className="report-detail-not-found">
        <p>Report not found.</p>
        <Link href="/report/">Report a scam</Link>
      </div>
    );
  }

  if ('status' in report && report.status === 'pending' && !('report_type' in report)) {
    return (
      <div className="report-detail-not-found">
        <p>{report.message}</p>
        <p className="report-detail-hidden-until">Hidden until approved.</p>
        <Link href="/report/">Report a scam</Link>
      </div>
    );
  }

  const fullReport = report as ReportResponseDto;
  const isPending = fullReport.status === 'pending';
  const isPublicPendingView = isPending && !viewToken;
  const detailValue = fullReport.report_type_detail?.trim();
  const showDetailRow = !!detailValue || isPending;
  const reportTypeLabel = REPORT_TYPE_LABELS[fullReport.report_type as ReportType] ?? fullReport.report_type;
  const categoryLabel = fullReport.category ? (SCAM_CATEGORY_LABELS[fullReport.category as keyof typeof SCAM_CATEGORY_LABELS] ?? fullReport.category) : null;
  const detailLabel =
    REPORT_TYPE_DETAIL_SHORT_LABELS[fullReport.report_type as ReportType] ?? fullReport.report_type;
  const isUrl = !!detailValue && /^https?:\/\//i.test(detailValue);
  const similarCount = typeof fullReport.similar_count === 'number' ? fullReport.similar_count : 0;

  return (
    <article className="report-detail-card">
      {isPending && (
        <p className="report-detail-status-pending" role="status">
          Status: Waiting for approval. Hidden until approved. {fullReport.message ?? 'It may take up to 48 hours.'}
        </p>
      )}
      {isPending && viewToken && (
        <div className="report-detail-copy-notice" role="alert">
          <strong>Copy your report URL below and save it.</strong> This full view of your report will not be accessible again after you close or leave this page—we don’t email the link.
        </div>
      )}
      {!isPending && similarCount > 0 && (
        <p className="report-detail-similar" role="status">
          <strong>{similarCount} other {similarCount === 1 ? 'user has' : 'users have'} reported this same {detailLabel.toLowerCase()}.</strong>
        </p>
      )}
      {viewToken && (
        <div className="report-detail-save-id-block" role="region" aria-labelledby="report-detail-save-id-heading">
          <h2 id="report-detail-save-id-heading" className="report-detail-save-id-heading">Save your report ID for later reference</h2>
          <p className="report-detail-save-id-intro">You can use this ID to look up your report later from the Scamenger website (use the &quot;Look up report&quot; link in the menu).</p>
          <div className="report-detail-save-id-value-wrap">
            <code className="report-detail-save-id-value">{fullReport.id}</code>
            <button type="button" onClick={handleCopyId} className="report-detail-copy-btn report-detail-copy-id-btn" aria-label="Copy report ID">
              {copiedId ? 'Copied!' : 'Copy ID'}
            </button>
          </div>
        </div>
      )}
      <section className="report-detail-meta-block" aria-label="Report details">
        <h2 className="report-detail-section-title">Report details</h2>
        <dl className="report-detail-meta">
          <div className="report-detail-meta-row">
            <dt className="report-detail-meta-label">Country of origin</dt>
            <dd className="report-detail-meta-value">{fullReport.country_origin}</dd>
          </div>
          <div className="report-detail-meta-row">
            <dt className="report-detail-meta-label">Type</dt>
            <dd className="report-detail-meta-value">
              <span className="report-detail-type-icon" aria-hidden="true">{REPORT_TYPE_ICONS[fullReport.report_type as ReportType] ?? '📋'}</span>{' '}
              {reportTypeLabel}
            </dd>
          </div>
          {categoryLabel && (
            <div className="report-detail-meta-row">
              <dt className="report-detail-meta-label">Category</dt>
              <dd className="report-detail-meta-value">{categoryLabel}</dd>
            </div>
          )}
          <div className="report-detail-meta-row">
            <dt className="report-detail-meta-label">Reported</dt>
            <dd className="report-detail-meta-value">{formatDate(fullReport.created_at)}</dd>
          </div>
          {(fullReport.lost_money || fullReport.lost_money_range) && (
            <div className="report-detail-meta-row">
              <dt className="report-detail-meta-label">Amount lost</dt>
              <dd className="report-detail-meta-value">
                <span className="report-detail-lost-badge">
                  {fullReport.lost_money_range && fullReport.lost_money_range !== 'none'
                    ? (LOST_MONEY_RANGE_LABELS[fullReport.lost_money_range as LostMoneyRange] ?? fullReport.lost_money_range)
                    : 'Lost money'}
                </span>
              </dd>
            </div>
          )}
          <div className="report-detail-meta-row">
            <dt className="report-detail-meta-label">Consent share on social (e.g. Facebook, X)</dt>
            <dd className="report-detail-meta-value">{fullReport.consent_share_social ? 'Yes' : 'No'}</dd>
          </div>
          {showDetailRow && (
            <div className="report-detail-meta-row">
              <dt className="report-detail-meta-label">{detailLabel}</dt>
              <dd className="report-detail-meta-value">
                {detailValue ? (
                  isUrl ? (
                    <a href={detailValue} target="_blank" rel="noopener noreferrer" className="report-detail-type-detail-link">{detailValue}</a>
                  ) : (
                    <span>{detailValue}</span>
                  )
                ) : isPublicPendingView ? (
                  <span className="report-detail-masked" aria-hidden="true">Hidden until approved</span>
                ) : (
                  <span className="report-detail-waiting">Waiting for approval</span>
                )}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {fullReport.narrative ? (
        <section className="report-detail-narrative-block" aria-label="Description of the incident">
          <h2 className="report-detail-section-title">Description of the incident</h2>
          <p className="report-detail-narrative">{fullReport.narrative}</p>
        </section>
      ) : isPublicPendingView ? (
        <section className="report-detail-narrative-block" aria-label="Description of the incident">
          <h2 className="report-detail-section-title">Description of the incident</h2>
          <div className="report-detail-masked report-detail-masked-block" aria-hidden="true">
            <span className="report-detail-masked-line" />
            <span className="report-detail-masked-line" />
            <span className="report-detail-masked-line report-detail-masked-line-short" />
          </div>
        </section>
      ) : isPending ? (
        <section className="report-detail-narrative-block" aria-label="Description of the incident">
          <h2 className="report-detail-section-title">Description of the incident</h2>
          <p className="report-detail-waiting">Waiting for approval</p>
        </section>
      ) : null}

      <section className="report-detail-share-block" aria-label="Share this report">
        <h2 className="report-detail-section-title">Share this report</h2>
        {isPending && viewToken ? (
          <>
            <p className="report-detail-save-hint">Save this link now—you won’t be able to return to this full view after you close the page.</p>
            <p className="report-detail-share-label">Your link (full view while pending)</p>
            <p className="report-detail-share-url report-detail-share-url-full">
              <a href={fullReportUrl} target="_blank" rel="noopener noreferrer" className="report-detail-share-link">
                {fullReportUrl}
              </a>
            </p>
            <button type="button" onClick={handleCopyUrl} disabled={!fullReportUrl} className="report-detail-copy-btn" aria-label="Copy your report URL">
              {copied ? 'Copied!' : 'Copy your link'}
            </button>
            <p className="report-detail-share-label">Public link (share after approval)</p>
            <p className="report-detail-share-url report-detail-share-url-full">
              <a href={publicReportUrl} target="_blank" rel="noopener noreferrer" className="report-detail-share-link">
                {publicReportUrl}
              </a>
            </p>
            <button type="button" onClick={handleCopyPublicUrl} disabled={!publicReportUrl} className="report-detail-copy-btn" aria-label="Copy public report URL">
              {copied ? 'Copied!' : 'Copy public link'}
            </button>
          </>
        ) : (
          <>
        <p className="report-detail-share-url report-detail-share-url-full">
          {fullReportUrl ? (
            <a href={fullReportUrl} target="_blank" rel="noopener noreferrer" className="report-detail-share-link">
              {fullReportUrl}
            </a>
          ) : (
            <span className="report-detail-share-link">/reports/?id={fullReport.id}</span>
          )}
        </p>
        <button
          type="button"
          onClick={handleCopyUrl}
          disabled={!fullReportUrl}
          className="report-detail-copy-btn"
          aria-label="Copy report URL"
        >
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
        {fullReportUrl && (
          <>
            <p className="report-detail-share-or" aria-hidden="true">OR</p>
            <div className="report-detail-qr" aria-label="QR code for report link">
              <QRCodeSVG value={fullReportUrl} size={160} level="M" includeMargin />
              <p className="report-detail-qr-label">Scan to open report</p>
            </div>
          </>
        )}
          </>
        )}
      </section>

      {!isPending && fullReport.status !== 'pending' && (
        <DidThisHelpVote reportId={fullReport.id} visible />
      )}

      {!isPending && fullReport.status !== 'pending' && (
        <section className="report-detail-ratings" aria-labelledby="report-detail-ratings-heading">
          <h2 id="report-detail-ratings-heading" className="report-detail-ratings-heading">
            Rate this report
          </h2>
          {(fullReport.rating_count ?? 0) > 0 && (
            <p className="report-detail-ratings-count">
              {fullReport.rating_count} {fullReport.rating_count === 1 ? 'person has' : 'people have'} rated this report.
              {typeof fullReport.avg_credibility === 'number' && (
                <> Credibility {fullReport.avg_credibility.toFixed(1)} · Usefulness {(fullReport.avg_usefulness ?? 0).toFixed(1)} · Completeness {(fullReport.avg_completeness ?? 0).toFixed(1)} · Relevance {(fullReport.avg_relevance ?? 0).toFixed(1)} (avg 1–5)</>
              )}
            </p>
          )}
          <RateReportForm
            reportId={fullReport.id}
            onRated={handleRated}
            initialRating={('user_rating' in fullReport && fullReport.user_rating) ? fullReport.user_rating : undefined}
          />
        </section>
      )}

      <p className="report-detail-back">
        <Link href="/report/">Report another scam</Link>
      </p>
    </article>
  );
}

export function ReportDetailClient() {
  return (
    <Suspense fallback={<div className="report-detail-loading">Loading…</div>}>
      <ReportDetailInner />
    </Suspense>
  );
}
