'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { getReportById } from '@/data/reports/api';
import { REPORT_TYPE_LABELS, LOST_MONEY_RANGE_LABELS, REPORT_TYPE_DETAIL_SHORT_LABELS, type ReportType } from '@/data/reports/api';
import type { ReportResponseDto, GetReportByIdResponse } from '@/data/reports/api';
import type { LostMoneyRange } from '@/data/reports/api';
import { SCAM_CATEGORY_LABELS } from '@/data/scams/types';

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
    getReportById(reportId, viewToken || undefined)
      .then((data) => {
        if (!cancelled) {
          setReport(data ?? null);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load report');
          setReport(null);
        }
      });
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
      <section className="report-detail-meta-block" aria-label="Report details">
        <h2 className="report-detail-section-title">Report details</h2>
        <dl className="report-detail-meta">
          <div className="report-detail-meta-row">
            <dt className="report-detail-meta-label">Country of origin</dt>
            <dd className="report-detail-meta-value">{fullReport.country_origin}</dd>
          </div>
          <div className="report-detail-meta-row">
            <dt className="report-detail-meta-label">Type</dt>
            <dd className="report-detail-meta-value">{reportTypeLabel}</dd>
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
