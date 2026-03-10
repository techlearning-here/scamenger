'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getStoredAdminToken,
  clearStoredAdminToken,
  listAdminReports,
  getApprovedStats,
  getSettings,
  updateSettings,
  approveReport,
  rejectReport,
  deleteReport,
  type AdminReportDto,
  type AdminApprovedStatsResponse,
  type SiteSettingsDto,
} from '@/data/admin/api';
import { invalidateConfigCache } from '@/data/config/api';
import { FacebookShareModal } from './components/FacebookShareModal';
import { REPORT_TYPE_LABELS, REPORT_TYPE_ICONS } from '@/data/reports/api';
import { SCAM_CATEGORY_LABELS } from '@/data/scams/types';

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

const PAGE_SIZE = 20;

export default function AdminDashboardPage() {
  const router = useRouter();
  const [pendingItems, setPendingItems] = useState<AdminReportDto[]>([]);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [rejectedItems, setRejectedItems] = useState<AdminReportDto[]>([]);
  const [rejectedPage, setRejectedPage] = useState(1);
  const [rejectedTotal, setRejectedTotal] = useState(0);
  const [approvedItems, setApprovedItems] = useState<AdminReportDto[]>([]);
  const [approvedPage, setApprovedPage] = useState(1);
  const [approvedTotal, setApprovedTotal] = useState(0);
  const [stats, setStats] = useState<AdminApprovedStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [reportForFacebook, setReportForFacebook] = useState<AdminReportDto | null>(null);
  const [settings, setSettings] = useState<SiteSettingsDto | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [draftShowReportScam, setDraftShowReportScam] = useState(true);
  const [draftShowFacebookConsent, setDraftShowFacebookConsent] = useState(true);
  const [searchReportId, setSearchReportId] = useState('');

  useEffect(() => {
    if (settings != null) {
      setDraftShowReportScam(settings.show_report_scam);
      setDraftShowFacebookConsent(settings.show_facebook_consent);
    }
  }, [settings]);

  useEffect(() => {
    const t = getStoredAdminToken();
    setToken(t);
    if (!t) router.replace('/z7k2m9/login/');
  }, [router]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    Promise.all([
      listAdminReports(token, { status: 'pending', page: pendingPage, page_size: PAGE_SIZE }),
      listAdminReports(token, { status: 'rejected', page: rejectedPage, page_size: PAGE_SIZE }),
      listAdminReports(token, { status: 'approved', page: approvedPage, page_size: PAGE_SIZE }),
      getApprovedStats(token),
      getSettings(token),
    ])
      .then(([pendingRes, rejectedRes, approvedRes, statsRes, settingsRes]) => {
        if (cancelled) return;
        setPendingItems(pendingRes.items);
        setPendingTotal(pendingRes.total);
        setRejectedItems(rejectedRes.items);
        setRejectedTotal(rejectedRes.total);
        setApprovedItems(approvedRes.items);
        setApprovedTotal(approvedRes.total);
        setStats(statsRes);
        setSettings(settingsRes);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load reports');
          if (err instanceof Error && err.message === 'Unauthorized') {
            clearStoredAdminToken();
            router.replace('/z7k2m9/login/');
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [token, router, pendingPage, rejectedPage, approvedPage]);

  async function handleApprove(reportId: string) {
    if (!token) return;
    setActionId(reportId);
    setError(null);
    try {
      await approveReport(reportId, token);
      setPendingItems((prev) => prev.filter((r) => r.id !== reportId));
      setPendingTotal((t) => Math.max(0, t - 1));
      if (stats) {
        setStats({
          ...stats,
          total_approved: stats.total_approved + 1,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(reportId: string) {
    if (!token) return;
    setActionId(reportId);
    setError(null);
    try {
      const updated = await rejectReport(reportId, token);
      setPendingItems((prev) => prev.filter((r) => r.id !== reportId));
      setPendingTotal((t) => Math.max(0, t - 1));
      setRejectedItems((prev) => [updated, ...prev]);
      setRejectedTotal((t) => t + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(reportId: string) {
    if (!token) return;
    if (!window.confirm('Permanently delete this report? This cannot be undone.')) return;
    setActionId(reportId);
    setError(null);
    try {
      await deleteReport(reportId, token);
      const wasPending = pendingItems.some((r) => r.id === reportId);
      const wasRejected = rejectedItems.some((r) => r.id === reportId);
      const wasApproved = approvedItems.some((r) => r.id === reportId);
      setPendingItems((prev) => prev.filter((r) => r.id !== reportId));
      setRejectedItems((prev) => prev.filter((r) => r.id !== reportId));
      setApprovedItems((prev) => prev.filter((r) => r.id !== reportId));
      if (wasPending) setPendingTotal((t) => Math.max(0, t - 1));
      if (wasRejected) setRejectedTotal((t) => Math.max(0, t - 1));
      if (wasApproved) setApprovedTotal((t) => Math.max(0, t - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setActionId(null);
    }
  }

  function handleLogout() {
    clearStoredAdminToken();
    router.replace('/z7k2m9/login/');
  }

  function handleToggleShowFacebookConsent() {
    setDraftShowFacebookConsent((prev) => !prev);
  }

  function handleToggleShowReportScam() {
    setDraftShowReportScam((prev) => !prev);
  }

  async function handleApplySettings() {
    if (!token) return;
    setSettingsSaving(true);
    setError(null);
    try {
      const updated = await updateSettings(token, {
        show_report_scam: draftShowReportScam,
        show_facebook_consent: draftShowFacebookConsent,
      });
      setSettings(updated);
      invalidateConfigCache();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setSettingsSaving(false);
    }
  }

  if (!token) return null;

  const pendingPages = Math.max(1, Math.ceil(pendingTotal / PAGE_SIZE));
  const rejectedPages = Math.max(1, Math.ceil(rejectedTotal / PAGE_SIZE));
  const approvedPages = Math.max(1, Math.ceil(approvedTotal / PAGE_SIZE));

  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Admin</span>
      </nav>
      <div className="admin-header">
        <h1 className="report-scam-title">Admin – Reports</h1>
        <div className="admin-header-actions">
          <Link href="/z7k2m9/messages/" className="admin-logout-btn">View messages</Link>
          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-btn"
          >
            Log out
          </button>
        </div>
      </div>
      <p className="report-scam-lead">
        Review pending and rejected reports. Only approved reports are visible to the public; approved reports are not listed here.
      </p>
      <section className="admin-search-report" aria-labelledby="admin-search-heading">
        <h2 id="admin-search-heading" className="admin-section-title">Search by report ID</h2>
        <form
          className="admin-search-report-form"
          onSubmit={(e) => {
            e.preventDefault();
            const id = searchReportId.trim();
            if (id) router.push(`/z7k2m9/reports/${encodeURIComponent(id)}`);
          }}
        >
          <label htmlFor="admin-search-report-id" className="visually-hidden">Report ID</label>
          <input
            id="admin-search-report-id"
            type="text"
            value={searchReportId}
            onChange={(e) => setSearchReportId(e.target.value)}
            placeholder="e.g. ecfb0b4a-3398-433a-8a36-d1d519d6f4f7"
            className="form-control admin-search-report-input"
            aria-describedby="admin-search-report-desc"
          />
          <button type="submit" className="report-scam-submit admin-search-report-btn">
            Go to report
          </button>
        </form>
        <p id="admin-search-report-desc" className="admin-search-report-desc">Enter a report ID to view, edit, or delete that report.</p>
      </section>
      {error && (
        <div className="report-scam-error" role="alert">
          {error}
        </div>
      )}
      {settings != null && (
        <section className="admin-settings-block" aria-labelledby="admin-settings-heading">
          <h2 id="admin-settings-heading" className="admin-settings-heading">Settings</h2>
          <div className="admin-settings-row">
            <label className="admin-settings-label">
              <input
                type="checkbox"
                checked={draftShowReportScam}
                onChange={handleToggleShowReportScam}
                disabled={settingsSaving}
                aria-describedby="admin-settings-report-desc"
              />
              <span id="admin-settings-report-desc">Enable &quot;Report a scam&quot; (nav button and menu item)</span>
            </label>
          </div>
          <div className="admin-settings-row">
            <label className="admin-settings-label">
              <input
                type="checkbox"
                checked={draftShowFacebookConsent}
                onChange={handleToggleShowFacebookConsent}
                disabled={settingsSaving}
                aria-describedby="admin-settings-fb-desc"
              />
              <span id="admin-settings-fb-desc">Show &quot;Share to Facebook&quot; consent on report form</span>
            </label>
          </div>
          <div className="admin-settings-row">
            <button
              type="button"
              onClick={handleApplySettings}
              disabled={settingsSaving}
              className="admin-settings-apply-btn"
            >
              {settingsSaving ? 'Applying…' : 'Apply'}
            </button>
          </div>
        </section>
      )}
      {stats !== null && (
        <section className="admin-stats-section" aria-labelledby="admin-stats-heading">
          <h2 id="admin-stats-heading" className="admin-section-title">
            Approved reports
          </h2>
          <p className="admin-stats-total">
            Total approved: <strong>{stats.total_approved}</strong>
          </p>
          {stats.by_category.length > 0 && (
            <>
              <h3 className="admin-stats-subtitle">By scam category</h3>
              <ul className="admin-stats-category-list">
                {stats.by_category.map(({ category, count }) => (
                  <li key={category ?? '__none__'} className="admin-stats-category-item">
                    <span className="admin-stats-category-label">
                      {category ? (SCAM_CATEGORY_LABELS[category as keyof typeof SCAM_CATEGORY_LABELS] ?? category) : 'Uncategorized'}
                    </span>
                    <span className="admin-stats-category-count">{count}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
      {loading ? (
        <p className="report-detail-loading">Loading reports…</p>
      ) : (
        <>
          {pendingTotal > 0 && (
            <section className="admin-section" aria-labelledby="pending-heading">
              <h2 id="pending-heading" className="admin-section-title">
                Pending ({pendingTotal})
              </h2>
              <ul className="admin-report-list">
                {pendingItems.map((r) => (
                  <li key={r.id} className="admin-report-item admin-report-item-pending">
                    <div className="admin-report-meta">
                      <span className="admin-report-id">{r.id}</span>
                      <span>{formatDate(r.created_at)}</span>
                      <span>{REPORT_TYPE_ICONS[r.report_type as keyof typeof REPORT_TYPE_ICONS] ?? '📋'} {REPORT_TYPE_LABELS[r.report_type as keyof typeof REPORT_TYPE_LABELS] ?? r.report_type}</span>
                      <span>{r.country_origin}</span>
                    </div>
                    <div className="admin-report-actions">
                      <button
                        type="button"
                        onClick={() => handleApprove(r.id)}
                        disabled={actionId === r.id}
                        className="report-scam-submit"
                      >
                        {actionId === r.id ? 'Approving…' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(r.id)}
                        disabled={actionId === r.id}
                        className="admin-report-reject-btn"
                      >
                        {actionId === r.id ? 'Rejecting…' : 'Reject'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        disabled={actionId === r.id}
                        className="admin-report-delete-btn"
                        aria-label="Delete report"
                      >
                        {actionId === r.id ? 'Deleting…' : 'Delete'}
                      </button>
                      <a
                        href={`/z7k2m9/reports/${encodeURIComponent(r.id)}`}
                        className="admin-report-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View full report
                      </a>
                      {r.consent_share_social && (
                        <button
                          type="button"
                          onClick={() => setReportForFacebook(r)}
                          className="admin-fb-share-btn"
                        >
                          Share to Facebook
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {pendingPages > 1 && (
                <nav className="admin-pagination" aria-label="Pending reports pagination">
                  <span className="admin-pagination-info">
                    Page {pendingPage} of {pendingPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
                    disabled={pendingPage <= 1}
                    className="admin-pagination-btn"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingPage((p) => Math.min(pendingPages, p + 1))}
                    disabled={pendingPage >= pendingPages}
                    className="admin-pagination-btn"
                  >
                    Next
                  </button>
                </nav>
              )}
            </section>
          )}
          {rejectedTotal > 0 && (
            <section className="admin-section" aria-labelledby="rejected-heading">
              <h2 id="rejected-heading" className="admin-section-title">
                Recently rejected ({rejectedTotal})
              </h2>
              <ul className="admin-report-list">
                {rejectedItems.map((r) => (
                  <li key={r.id} className="admin-report-item admin-report-item-rejected">
                    <div className="admin-report-meta">
                      <span className="admin-report-id">{r.id}</span>
                      <span>{formatDate(r.created_at)}</span>
                      <span>{REPORT_TYPE_ICONS[r.report_type as keyof typeof REPORT_TYPE_ICONS] ?? '📋'} {REPORT_TYPE_LABELS[r.report_type as keyof typeof REPORT_TYPE_LABELS] ?? r.report_type}</span>
                      <span>{r.country_origin}</span>
                    </div>
                    {r.narrative && (
                      <p className="admin-report-narrative">{r.narrative.slice(0, 150)}{r.narrative.length > 150 ? '…' : ''}</p>
                    )}
                    <div className="admin-report-actions">
                      <button
                        type="button"
                        onClick={() => handleApprove(r.id)}
                        disabled={actionId === r.id}
                        className="report-scam-submit"
                      >
                        {actionId === r.id ? 'Approving…' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        disabled={actionId === r.id}
                        className="admin-report-delete-btn"
                        aria-label="Delete report"
                      >
                        {actionId === r.id ? 'Deleting…' : 'Delete'}
                      </button>
                      <a
                        href={`/z7k2m9/reports/${encodeURIComponent(r.id)}`}
                        className="admin-report-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View full report
                      </a>
                      {r.consent_share_social && (
                        <button
                          type="button"
                          onClick={() => setReportForFacebook(r)}
                          className="admin-fb-share-btn"
                        >
                          Share to Facebook
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {rejectedPages > 1 && (
                <nav className="admin-pagination" aria-label="Rejected reports pagination">
                  <span className="admin-pagination-info">
                    Page {rejectedPage} of {rejectedPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRejectedPage((p) => Math.max(1, p - 1))}
                    disabled={rejectedPage <= 1}
                    className="admin-pagination-btn"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectedPage((p) => Math.min(rejectedPages, p + 1))}
                    disabled={rejectedPage >= rejectedPages}
                    className="admin-pagination-btn"
                  >
                    Next
                  </button>
                </nav>
              )}
            </section>
          )}
          {approvedTotal > 0 && (
            <section className="admin-section" aria-labelledby="approved-heading">
              <h2 id="approved-heading" className="admin-section-title">
                Recently approved ({approvedTotal})
              </h2>
              <ul className="admin-report-list">
                {approvedItems.map((r) => (
                  <li key={r.id} className="admin-report-item admin-report-item-approved">
                    <div className="admin-report-meta">
                      <span className="admin-report-id">{r.id}</span>
                      <span>{formatDate(r.created_at)}</span>
                      <span>{REPORT_TYPE_ICONS[r.report_type as keyof typeof REPORT_TYPE_ICONS] ?? '📋'} {REPORT_TYPE_LABELS[r.report_type as keyof typeof REPORT_TYPE_LABELS] ?? r.report_type}</span>
                      <span>{r.country_origin}</span>
                    </div>
                    <div className="admin-report-actions">
                      <a href={`/z7k2m9/reports/${encodeURIComponent(r.id)}`} className="admin-report-link" target="_blank" rel="noopener noreferrer">View full report</a>
                      <a href={`/reports/?id=${encodeURIComponent(r.id)}`} target="_blank" rel="noopener noreferrer" className="admin-report-link">View as public</a>
                      {r.consent_share_social && (
                        <button
                          type="button"
                          onClick={() => setReportForFacebook(r)}
                          className="admin-fb-share-btn"
                        >
                          Share to Facebook
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {approvedPages > 1 && (
                <nav className="admin-pagination" aria-label="Approved reports pagination">
                  <span className="admin-pagination-info">Page {approvedPage} of {approvedPages}</span>
                  <button type="button" onClick={() => setApprovedPage((p) => Math.max(1, p - 1))} disabled={approvedPage <= 1} className="admin-pagination-btn">Previous</button>
                  <button type="button" onClick={() => setApprovedPage((p) => Math.min(approvedPages, p + 1))} disabled={approvedPage >= approvedPages} className="admin-pagination-btn">Next</button>
                </nav>
              )}
            </section>
          )}
        </>
      )}
      {reportForFacebook && (
        <FacebookShareModal
          report={reportForFacebook}
          onClose={() => setReportForFacebook(null)}
        />
      )}
    </>
  );
}
