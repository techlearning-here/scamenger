'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  getStoredAdminToken,
  clearStoredAdminToken,
  getAdminReport,
  updateAdminReport,
  approveReport,
  rejectReport,
  deleteReport,
  type AdminReportDto,
  type AdminReportUpdateDto,
} from '@/data/admin/api';
import {
  REPORT_TYPE_LABELS,
  REPORT_TYPE_ICONS,
  LOST_MONEY_RANGE_OPTIONS,
  REPORT_TYPE_DETAIL_LABELS,
  type ReportType,
  type LostMoneyRange,
} from '@/data/reports/api';
import { COUNTRY_OPTIONS } from '@/data/reports/countries';
import { SCAM_CATEGORY_LABELS, type ScamCategoryId } from '@/data/scams/types';

const CATEGORY_OPTIONS: { value: ScamCategoryId; label: string }[] = (
  Object.entries(SCAM_CATEGORY_LABELS) as [ScamCategoryId, string][]
).map(([value, label]) => ({ value, label }));

const REPORT_TYPES: ReportType[] = [
  'website', 'phone', 'crypto', 'iban', 'social_media',
  'whatsapp', 'telegram', 'discord', 'other',
];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function AdminReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = typeof params.id === 'string' ? params.id : '';
  const [token, setToken] = useState<string | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const [report, setReport] = useState<AdminReportDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminReportUpdateDto>({});

  useEffect(() => {
    setToken(getStoredAdminToken());
    setHasCheckedAuth(true);
  }, []);

  const loadReport = useCallback(() => {
    if (!token || !reportId) return;
    setLoading(true);
    setError(null);
    getAdminReport(reportId, token)
      .then(setReport)
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load report');
        if (err instanceof Error && err.message === 'Unauthorized') {
          clearStoredAdminToken();
          router.replace('/z7k2m9/login/');
        }
      })
      .finally(() => setLoading(false));
  }, [reportId, token, router]);

  useEffect(() => {
    if (!hasCheckedAuth) return;
    if (!token) {
      router.replace('/z7k2m9/login/');
      return;
    }
    if (reportId) loadReport();
  }, [hasCheckedAuth, token, reportId, router, loadReport]);

  useEffect(() => {
    if (report && editing) {
      setForm({
        country_origin: report.country_origin,
        report_type: report.report_type,
        report_type_detail: report.report_type_detail ?? undefined,
        category: report.category ?? undefined,
        lost_money: report.lost_money,
        lost_money_range: (report.lost_money_range as LostMoneyRange) || undefined,
        narrative: report.narrative ?? undefined,
        status: report.status,
      });
    }
  }, [report, editing]);

  async function handleSave() {
    if (!token || !reportId) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateAdminReport(reportId, token, form);
      setReport(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleApprove() {
    if (!token || !reportId) return;
    setActionId(reportId);
    setError(null);
    try {
      const updated = await approveReport(reportId, token);
      setReport(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setActionId(null);
    }
  }

  async function handleReject() {
    if (!token || !reportId) return;
    setActionId(reportId);
    setError(null);
    try {
      const updated = await rejectReport(reportId, token);
      setReport(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete() {
    if (!token || !reportId) return;
    if (!window.confirm('Permanently delete this report? This cannot be undone.')) return;
    setActionId(reportId);
    setError(null);
    try {
      await deleteReport(reportId, token);
      router.push('/z7k2m9/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setActionId(null);
    }
  }

  if (!hasCheckedAuth) {
    return (
      <div className="admin-report-detail-wrap">
        <p className="report-detail-loading">Loading…</p>
      </div>
    );
  }
  if (!token) {
    return (
      <div className="admin-report-detail-wrap">
        <p className="report-detail-loading">Redirecting to login…</p>
      </div>
    );
  }
  if (loading || !reportId) {
    return (
      <div className="admin-report-detail-wrap">
        <p className="report-detail-loading">{loading ? 'Loading report…' : 'Missing report ID.'}</p>
      </div>
    );
  }
  if (error && !report) {
    return (
      <div className="admin-report-detail-wrap">
        <p className="report-scam-error" role="alert">{error}</p>
        <Link href="/z7k2m9/">Back to Admin</Link>
      </div>
    );
  }
  if (!report) return null;

  return (
    <div className="admin-report-detail-wrap">
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/z7k2m9/">Admin</Link>
        <span className="back-sep"> / </span>
        <span>Report {report.id.slice(0, 8)}…</span>
      </nav>
      <div className="admin-header">
        <h1 className="report-scam-title">Report – Full view</h1>
        <Link href="/z7k2m9/" className="admin-logout-btn">Back to list</Link>
      </div>
      {error && (
        <div className="report-scam-error" role="alert">{error}</div>
      )}

      {editing ? (
        <div className="admin-report-edit-form">
          <h2 className="admin-section-title">Edit report</h2>
          <div className="form-group">
            <label htmlFor="admin-edit-country">Country of origin</label>
            <select
              id="admin-edit-country"
              value={form.country_origin ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, country_origin: e.target.value }))}
              className="form-control"
            >
              {COUNTRY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="admin-edit-type">Report type</label>
            <select
              id="admin-edit-type"
              value={form.report_type ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, report_type: e.target.value }))}
              className="form-control"
            >
              {REPORT_TYPES.map((t) => (
                <option key={t} value={t}>{REPORT_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="admin-edit-type-detail">
              {form.report_type ? REPORT_TYPE_DETAIL_LABELS[form.report_type as ReportType]?.label : 'Details'}
            </label>
            <input
              id="admin-edit-type-detail"
              type="text"
              value={form.report_type_detail ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, report_type_detail: e.target.value || null }))}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-edit-category">Category</label>
            <select
              id="admin-edit-category"
              value={form.category ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, category: (e.target.value || null) as ScamCategoryId | null }))}
              className="form-control"
            >
              <option value="">—</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="admin-edit-lost">Amount lost</label>
            <select
              id="admin-edit-lost"
              value={form.lost_money_range ?? 'none'}
              onChange={(e) => setForm((f) => ({
                ...f,
                lost_money_range: e.target.value as LostMoneyRange,
                lost_money: e.target.value !== 'none',
              }))}
              className="form-control"
            >
              {LOST_MONEY_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="admin-edit-narrative">Description (narrative)</label>
            <textarea
              id="admin-edit-narrative"
              rows={6}
              value={form.narrative ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, narrative: e.target.value || null }))}
              className="form-control form-control-textarea"
              maxLength={3000}
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-edit-status">Status</label>
            <select
              id="admin-edit-status"
              value={form.status ?? report.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as AdminReportDto['status'] }))}
              className="form-control"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="admin-report-actions">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="report-scam-submit"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={saving}
              className="report-scam-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-report-actions admin-report-actions-top">
            {report.status === 'pending' && (
              <>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={!!actionId}
                  className="report-scam-submit"
                >
                  {actionId ? 'Approving…' : 'Approve'}
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={!!actionId}
                  className="admin-report-reject-btn"
                >
                  {actionId ? 'Rejecting…' : 'Reject'}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="report-scam-submit"
            >
              Edit report
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!!actionId}
              className="admin-report-delete-btn"
              aria-label="Delete report"
            >
              {actionId ? 'Deleting…' : 'Delete'}
            </button>
            <a
              href={`/reports/?id=${encodeURIComponent(report.id)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-report-link"
            >
              View as public
            </a>
          </div>
          <article className="report-detail-card admin-report-detail-card">
            <p className="report-detail-meta-row">
              <strong>Status:</strong>{' '}
              <span className={`admin-report-status admin-report-status-${report.status}`}>
                {report.status}
              </span>
            </p>
            <dl className="report-detail-meta">
              <div className="report-detail-meta-row">
                <dt className="report-detail-meta-label">ID</dt>
                <dd className="report-detail-meta-value">{report.id}</dd>
              </div>
              <div className="report-detail-meta-row">
                <dt className="report-detail-meta-label">Slug</dt>
                <dd className="report-detail-meta-value">{report.slug}</dd>
              </div>
              <div className="report-detail-meta-row">
                <dt className="report-detail-meta-label">Country of origin</dt>
                <dd className="report-detail-meta-value">{report.country_origin}</dd>
              </div>
              <div className="report-detail-meta-row">
                <dt className="report-detail-meta-label">Type</dt>
                <dd className="report-detail-meta-value">
                  <span className="report-detail-type-icon" aria-hidden="true">{REPORT_TYPE_ICONS[report.report_type as ReportType] ?? '📋'}</span>{' '}
                  {REPORT_TYPE_LABELS[report.report_type as ReportType] ?? report.report_type}
                </dd>
              </div>
              {report.report_type_detail && (
                <div className="report-detail-meta-row">
                  <dt className="report-detail-meta-label">Type detail</dt>
                  <dd className="report-detail-meta-value">
                    {/^https?:\/\//i.test(report.report_type_detail) ? (
                      <a href={report.report_type_detail} target="_blank" rel="noopener noreferrer">
                        {report.report_type_detail}
                      </a>
                    ) : (
                      report.report_type_detail
                    )}
                  </dd>
                </div>
              )}
              {report.category && (
                <div className="report-detail-meta-row">
                  <dt className="report-detail-meta-label">Category</dt>
                  <dd className="report-detail-meta-value">
                    {SCAM_CATEGORY_LABELS[report.category as ScamCategoryId] ?? report.category}
                  </dd>
                </div>
              )}
              <div className="report-detail-meta-row">
                <dt className="report-detail-meta-label">Reported</dt>
                <dd className="report-detail-meta-value">{formatDate(report.created_at)}</dd>
              </div>
              <div className="report-detail-meta-row">
                <dt className="report-detail-meta-label">Lost money</dt>
                <dd className="report-detail-meta-value">
                  {report.lost_money ? (report.lost_money_range || 'Yes') : 'No'}
                </dd>
              </div>
              <div className="report-detail-meta-row">
                <dt className="report-detail-meta-label">Consent share on social (e.g. Facebook)</dt>
                <dd className="report-detail-meta-value">{report.consent_share_social ? 'Yes' : 'No'}</dd>
              </div>
            </dl>
            {report.narrative && (
              <section className="report-detail-narrative-block">
                <h2 className="report-detail-section-title">Description of the incident</h2>
                <p className="report-detail-narrative">{report.narrative}</p>
              </section>
            )}
            <p className="report-detail-meta-row">
              <strong>Ratings:</strong> {report.rating_count} (avg credibility {report.avg_credibility?.toFixed(1) ?? '—'}, usefulness {report.avg_usefulness?.toFixed(1) ?? '—'})
            </p>
          </article>
        </>
      )}
    </div>
  );
}
