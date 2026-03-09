'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getStoredAdminToken,
  clearStoredAdminToken,
  listAdminReports,
  getApprovedStats,
  approveReport,
  rejectReport,
  deleteReport,
  type AdminReportDto,
  type AdminApprovedStatsResponse,
} from '@/data/admin/api';
import { REPORT_TYPE_LABELS } from '@/data/reports/api';
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
    ])
      .then(([pendingRes, rejectedRes, approvedRes, statsRes]) => {
        if (cancelled) return;
        setPendingItems(pendingRes.items);
        setPendingTotal(pendingRes.total);
        setRejectedItems(rejectedRes.items);
        setRejectedTotal(rejectedRes.total);
        setApprovedItems(approvedRes.items);
        setApprovedTotal(approvedRes.total);
        setStats(statsRes);
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
      {error && (
        <div className="report-scam-error" role="alert">
          {error}
        </div>
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
                      <span className="admin-report-id">{r.id.slice(0, 8)}…</span>
                      <span>{formatDate(r.created_at)}</span>
                      <span>{REPORT_TYPE_LABELS[r.report_type as keyof typeof REPORT_TYPE_LABELS] ?? r.report_type}</span>
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
                      <span className="admin-report-id">{r.id.slice(0, 8)}…</span>
                      <span>{formatDate(r.created_at)}</span>
                      <span>{REPORT_TYPE_LABELS[r.report_type as keyof typeof REPORT_TYPE_LABELS] ?? r.report_type}</span>
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
                      <span className="admin-report-id">{r.id.slice(0, 8)}…</span>
                      <span>{formatDate(r.created_at)}</span>
                      <span>{REPORT_TYPE_LABELS[r.report_type as keyof typeof REPORT_TYPE_LABELS] ?? r.report_type}</span>
                      <span>{r.country_origin}</span>
                    </div>
                    <div className="admin-report-actions">
                      <a href={`/z7k2m9/reports/${encodeURIComponent(r.id)}`} className="admin-report-link" target="_blank" rel="noopener noreferrer">View full report</a>
                      <a href={`/reports/?id=${encodeURIComponent(r.id)}`} target="_blank" rel="noopener noreferrer" className="admin-report-link">View as public</a>
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
    </>
  );
}
