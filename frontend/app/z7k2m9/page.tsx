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
  listContactMessages,
  getContactMessage,
  deleteContactMessage,
  type AdminReportDto,
  type AdminApprovedStatsResponse,
  type SiteSettingsDto,
  type ContactMessageDto,
} from '@/data/admin/api';
import { invalidateConfigCache } from '@/data/config/api';
import { FacebookShareModal } from './components/FacebookShareModal';
import { XShareModal } from './components/XShareModal';
import { ThreadsShareModal } from './components/ThreadsShareModal';
import { FacebookIcon, XIcon, ThreadsIcon, ExternalLinkIcon, GlobeIcon, CheckIcon, RejectIcon, TrashIcon, CopyIcon } from './components/SocialShareIcons';
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

/** Short report ID for list display (first 8 chars); full ID available on hover. */
function shortReportId(id: string, maxLength = 8): string {
  if (!id || id.length <= maxLength) return id;
  return id.slice(0, maxLength);
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
  const [reportForX, setReportForX] = useState<AdminReportDto | null>(null);
  const [reportForThreads, setReportForThreads] = useState<AdminReportDto | null>(null);
  const [settings, setSettings] = useState<SiteSettingsDto | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [draftShowReportScam, setDraftShowReportScam] = useState(true);
  const [draftShowFacebookConsent, setDraftShowFacebookConsent] = useState(true);
  const [searchReportId, setSearchReportId] = useState('');
  type AdminTab = 'overview' | 'search' | 'messages' | 'settings' | 'pending' | 'rejected' | 'approved';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [messages, setMessages] = useState<ContactMessageDto[]>([]);
  const [messagesTotal, setMessagesTotal] = useState(0);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [messageDetail, setMessageDetail] = useState<ContactMessageDto | null>(null);
  const [messageActionId, setMessageActionId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyReportIdToClipboard(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      const t = setTimeout(() => setCopiedId(null), 1500);
      return () => clearTimeout(t);
    } catch {
      setCopiedId(null);
    }
  }

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
  }, [token, router, pendingPage, rejectedPage, approvedPage, refreshKey]);

  useEffect(() => {
    if (!token || activeTab !== 'messages') return;
    setMessagesLoading(true);
    setMessagesError(null);
    listContactMessages(token)
      .then((res) => {
        setMessages(res.items);
        setMessagesTotal(res.total);
      })
      .catch((err) => {
        setMessagesError(err instanceof Error ? err.message : 'Failed to load messages');
        if (err instanceof Error && err.message === 'Unauthorized') {
          clearStoredAdminToken();
          router.replace('/z7k2m9/login/');
        }
      })
      .finally(() => setMessagesLoading(false));
  }, [token, router, activeTab]);

  async function handleExpandMessage(id: string) {
    if (!token) return;
    if (expandedMessageId === id) {
      setExpandedMessageId(null);
      setMessageDetail(null);
      return;
    }
    setMessageActionId(id);
    setMessagesError(null);
    try {
      const msg = await getContactMessage(id, token, true);
      setMessageDetail(msg);
      setExpandedMessageId(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
      );
    } catch (err) {
      setMessagesError(err instanceof Error ? err.message : 'Failed to load message');
    } finally {
      setMessageActionId(null);
    }
  }

  async function handleDeleteMessage(id: string) {
    if (!token) return;
    if (!window.confirm('Permanently delete this message?')) return;
    setMessageActionId(id);
    setMessagesError(null);
    try {
      await deleteContactMessage(id, token);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setMessagesTotal((t) => Math.max(0, t - 1));
      if (expandedMessageId === id) {
        setExpandedMessageId(null);
        setMessageDetail(null);
      }
    } catch (err) {
      setMessagesError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setMessageActionId(null);
    }
  }

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
    <div className="admin-page-root">
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Admin</span>
      </nav>
      <div className="admin-header">
        <h1 className="report-scam-title">Admin – Reports</h1>
        <div className="admin-header-actions">
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
      <div className="admin-tabs-layout">
        <nav className="admin-tabs-nav" aria-label="Admin sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'overview'}
            aria-controls="admin-panel-overview"
            id="admin-tab-overview"
            className={`admin-tabs-nav-item ${activeTab === 'overview' ? 'admin-tabs-nav-item-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'search'}
            aria-controls="admin-panel-search"
            id="admin-tab-search"
            className={`admin-tabs-nav-item ${activeTab === 'search' ? 'admin-tabs-nav-item-active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search report
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'messages'}
            aria-controls="admin-panel-messages"
            id="admin-tab-messages"
            className={`admin-tabs-nav-item ${activeTab === 'messages' ? 'admin-tabs-nav-item-active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages{messagesTotal > 0 ? ` (${messagesTotal})` : ''}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'settings'}
            aria-controls="admin-panel-settings"
            id="admin-tab-settings"
            className={`admin-tabs-nav-item ${activeTab === 'settings' ? 'admin-tabs-nav-item-active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pending'}
            aria-controls="admin-panel-pending"
            id="admin-tab-pending"
            className={`admin-tabs-nav-item ${activeTab === 'pending' ? 'admin-tabs-nav-item-active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({pendingTotal})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rejected'}
            aria-controls="admin-panel-rejected"
            id="admin-tab-rejected"
            className={`admin-tabs-nav-item ${activeTab === 'rejected' ? 'admin-tabs-nav-item-active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected ({rejectedTotal})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'approved'}
            aria-controls="admin-panel-approved"
            id="admin-tab-approved"
            className={`admin-tabs-nav-item ${activeTab === 'approved' ? 'admin-tabs-nav-item-active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Recently approved ({approvedTotal})
          </button>
        </nav>
        <div className="admin-tabs-panels">
          {activeTab === 'settings' && (
            <div id="admin-panel-settings" role="tabpanel" aria-labelledby="admin-tab-settings" className="admin-tabs-panel">
              {settings != null && (
        <section className="admin-settings-block" aria-labelledby="admin-settings-heading">
          <h2 id="admin-settings-heading" className="admin-settings-heading">Settings</h2>
          <div className="admin-table-wrap">
            <table className="admin-table admin-settings-table">
              <thead>
                <tr>
                  <th scope="col">Setting</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Enable &quot;Report a scam&quot; (nav button and menu item)</td>
                  <td>
                    <label className="admin-settings-label">
                      <input
                        type="checkbox"
                        checked={draftShowReportScam}
                        onChange={handleToggleShowReportScam}
                        disabled={settingsSaving}
                        aria-describedby="admin-settings-report-desc"
                      />
                      <span id="admin-settings-report-desc">On</span>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td>Show &quot;Share to Facebook & X&quot; consent on report form</td>
                  <td>
                    <label className="admin-settings-label">
                      <input
                        type="checkbox"
                        checked={draftShowFacebookConsent}
                        onChange={handleToggleShowFacebookConsent}
                        disabled={settingsSaving}
                        aria-describedby="admin-settings-fb-desc"
                      />
                      <span id="admin-settings-fb-desc">On</span>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <button
                      type="button"
                      onClick={handleApplySettings}
                      disabled={settingsSaving}
                      className="admin-settings-apply-btn"
                    >
                      {settingsSaving ? 'Applying…' : 'Apply'}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
              )}
              {settings === null && !loading && (
        <section className="admin-settings-block" aria-labelledby="admin-settings-heading">
          <h2 id="admin-settings-heading" className="admin-settings-heading">Settings</h2>
          <p className="admin-table-empty">Settings could not be loaded.</p>
        </section>
              )}
            </div>
          )}
          {activeTab === 'overview' && (
            <div id="admin-panel-overview" role="tabpanel" aria-labelledby="admin-tab-overview" className="admin-tabs-panel">
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
              {loading && <p className="report-detail-loading">Loading reports…</p>}
            </div>
          )}
          {activeTab === 'search' && (
            <div id="admin-panel-search" role="tabpanel" aria-labelledby="admin-tab-search" className="admin-tabs-panel">
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
                  <button type="submit" className="report-scam-submit admin-search-report-btn" aria-label="Go to report" data-tooltip="Go to report">
                    <ExternalLinkIcon className="admin-btn-icon" />
                  </button>
                </form>
                <p id="admin-search-report-desc" className="admin-search-report-desc">Enter a report ID to view, edit, or delete that report.</p>
              </section>
            </div>
          )}
          {activeTab === 'messages' && (
            <div id="admin-panel-messages" role="tabpanel" aria-labelledby="admin-tab-messages" className="admin-tabs-panel">
              {messagesError && (
                <div className="report-scam-error" role="alert">{messagesError}</div>
              )}
              {messagesLoading ? (
                <p className="report-detail-loading">Loading messages…</p>
              ) : messages.length === 0 ? (
                <p className="report-detail-not-found">No messages yet.</p>
              ) : (
                <section className="admin-section" aria-label="Contact messages">
                  <p className="admin-stats-total">Total: <strong>{messagesTotal}</strong></p>
                  <ul className="admin-report-list">
                    {messages.map((m) => (
                      <li
                        key={m.id}
                        className={`admin-report-item admin-message-item ${m.read ? 'admin-message-read' : 'admin-message-unread'}`}
                      >
                        <div className="admin-message-header">
                          <button
                            type="button"
                            className="admin-message-toggle"
                            onClick={() => handleExpandMessage(m.id)}
                            disabled={messageActionId === m.id}
                            aria-expanded={expandedMessageId === m.id}
                          >
                            <span className="admin-message-preview">
                              {m.message.slice(0, 80)}{m.message.length > 80 ? '…' : ''}
                            </span>
                            <span className="admin-message-meta">
                              {m.name || m.email ? [m.name, m.email].filter(Boolean).join(' · ') : '(no name/email)'}
                              {' · '}
                              {formatDate(m.created_at)}
                              {!m.read && ' · New'}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(m.id)}
                            disabled={messageActionId === m.id}
                            className="admin-report-delete-btn"
                            aria-label={messageActionId === m.id ? 'Deleting…' : 'Delete message'}
                            data-tooltip={messageActionId === m.id ? 'Deleting…' : 'Delete'}
                          >
                            <TrashIcon className="admin-btn-icon" />
                          </button>
                        </div>
                        {expandedMessageId === m.id && messageDetail?.id === m.id && (
                          <div className="admin-message-body">
                            {messageDetail.name && <p><strong>Name:</strong> {messageDetail.name}</p>}
                            {messageDetail.email && <p><strong>Email:</strong> <a href={`mailto:${messageDetail.email}`}>{messageDetail.email}</a></p>}
                            <p><strong>Message:</strong></p>
                            <p className="admin-message-text">{messageDetail.message}</p>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
          {activeTab === 'pending' && (
            <div id="admin-panel-pending" role="tabpanel" aria-labelledby="admin-tab-pending" className="admin-tabs-panel">
      {loading ? (
        <p className="report-detail-loading">Loading reports…</p>
      ) : (
        <>
          <section className="admin-section" aria-labelledby="pending-heading">
            <h2 id="pending-heading" className="admin-section-title">
              Pending ({pendingTotal})
            </h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Report ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Type</th>
                    <th scope="col">Country</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTotal === 0 ? (
                    <tr>
                      <td colSpan={5} className="admin-table-empty">No pending reports</td>
                    </tr>
                  ) : (
                    pendingItems.map((r) => (
                      <tr key={r.id} className="admin-report-item-pending">
                        <td className="admin-table-id" title={r.id}>
                          <span className="admin-report-id-short">{shortReportId(r.id)}</span>
                          <button
                            type="button"
                            onClick={() => copyReportIdToClipboard(r.id)}
                            className="admin-copy-id-btn"
                            aria-label={copiedId === r.id ? 'Copied!' : 'Copy full report ID'}
                            data-tooltip={copiedId === r.id ? 'Copied!' : 'Copy ID'}
                          >
                            {copiedId === r.id ? <CheckIcon className="admin-copy-id-icon" /> : <CopyIcon className="admin-copy-id-icon" />}
                          </button>
                        </td>
                        <td>{formatDate(r.created_at)}</td>
                        <td>{REPORT_TYPE_ICONS[r.report_type as keyof typeof REPORT_TYPE_ICONS] ?? '📋'} {REPORT_TYPE_LABELS[r.report_type as keyof typeof REPORT_TYPE_LABELS] ?? r.report_type}</td>
                        <td>{r.country_origin}</td>
                        <td className="admin-table-actions">
                          <button
                            type="button"
                            onClick={() => handleApprove(r.id)}
                            disabled={actionId === r.id}
                            className="report-scam-submit"
                            aria-label={actionId === r.id ? 'Approving…' : 'Approve'}
                            data-tooltip={actionId === r.id ? 'Approving…' : 'Approve'}
                          >
                            <CheckIcon className="admin-btn-icon" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(r.id)}
                            disabled={actionId === r.id}
                            className="admin-report-reject-btn"
                            aria-label={actionId === r.id ? 'Rejecting…' : 'Reject'}
                            data-tooltip={actionId === r.id ? 'Rejecting…' : 'Reject'}
                          >
                            <RejectIcon className="admin-btn-icon" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(r.id)}
                            disabled={actionId === r.id}
                            className="admin-report-delete-btn"
                            aria-label={actionId === r.id ? 'Deleting…' : 'Delete report'}
                            data-tooltip={actionId === r.id ? 'Deleting…' : 'Delete'}
                          >
                            <TrashIcon className="admin-btn-icon" />
                          </button>
                          <a
                            href={`/z7k2m9/reports/${encodeURIComponent(r.id)}`}
                            className="admin-report-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View full report"
                            data-tooltip="View full report"
                          >
                            <ExternalLinkIcon className="admin-report-link-icon" />
                          </a>
                          {r.consent_share_social && (
                            <>
                              <button
                                type="button"
                                onClick={() => setReportForFacebook(r)}
                                className={`admin-fb-share-btn${r.facebook_posted_at ? ' admin-fb-share-btn-posted' : ''}`}
                                aria-label={r.facebook_posted_at ? 'Shared to Facebook' : 'Share to Facebook'}
                                data-tooltip={r.facebook_posted_at ? 'Shared to Facebook' : 'Share to Facebook'}
                              >
                                <FacebookIcon />
                              </button>
                            </>
                          )}
                                {r.consent_share_social && (
                            <button
                              type="button"
                              onClick={() => setReportForX(r)}
                              className="admin-x-share-btn"
                              aria-label="Share to X"
                              data-tooltip="Share to X"
                            >
                              <XIcon />
                            </button>
                          )}
                          {r.consent_share_social && (
                            <button
                              type="button"
                              onClick={() => setReportForThreads(r)}
                              className="admin-threads-share-btn"
                              aria-label="Share to Threads"
                              data-tooltip="Share to Threads"
                            >
                              <ThreadsIcon />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
        </>
      )}
            </div>
          )}
          {activeTab === 'rejected' && (
            <div id="admin-panel-rejected" role="tabpanel" aria-labelledby="admin-tab-rejected" className="admin-tabs-panel">
              {loading ? (
                <p className="report-detail-loading">Loading reports…</p>
              ) : (
                <>
          <section className="admin-section" aria-labelledby="rejected-heading">
            <h2 id="rejected-heading" className="admin-section-title">
              Recently rejected ({rejectedTotal})
            </h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Report ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Type</th>
                    <th scope="col">Country</th>
                    <th scope="col">Narrative</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedTotal === 0 ? (
                    <tr>
                      <td colSpan={6} className="admin-table-empty">No rejected reports</td>
                    </tr>
                  ) : (
                    rejectedItems.map((r) => (
                      <tr key={r.id} className="admin-report-item-rejected">
                        <td className="admin-table-id" title={r.id}>
                          <span className="admin-report-id-short">{shortReportId(r.id)}</span>
                          <button
                            type="button"
                            onClick={() => copyReportIdToClipboard(r.id)}
                            className="admin-copy-id-btn"
                            aria-label={copiedId === r.id ? 'Copied!' : 'Copy full report ID'}
                            data-tooltip={copiedId === r.id ? 'Copied!' : 'Copy ID'}
                          >
                            {copiedId === r.id ? <CheckIcon className="admin-copy-id-icon" /> : <CopyIcon className="admin-copy-id-icon" />}
                          </button>
                        </td>
                        <td>{formatDate(r.created_at)}</td>
                        <td>{REPORT_TYPE_ICONS[r.report_type as keyof typeof REPORT_TYPE_ICONS] ?? '📋'} {REPORT_TYPE_LABELS[r.report_type as keyof typeof REPORT_TYPE_LABELS] ?? r.report_type}</td>
                        <td>{r.country_origin}</td>
                        <td>{r.narrative ? `${r.narrative.slice(0, 100)}${r.narrative.length > 100 ? '…' : ''}` : '—'}</td>
                        <td className="admin-table-actions">
                          <button
                            type="button"
                            onClick={() => handleApprove(r.id)}
                            disabled={actionId === r.id}
                            className="report-scam-submit"
                            aria-label={actionId === r.id ? 'Approving…' : 'Approve'}
                            data-tooltip={actionId === r.id ? 'Approving…' : 'Approve'}
                          >
                            <CheckIcon className="admin-btn-icon" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(r.id)}
                            disabled={actionId === r.id}
                            className="admin-report-delete-btn"
                            aria-label={actionId === r.id ? 'Deleting…' : 'Delete report'}
                            data-tooltip={actionId === r.id ? 'Deleting…' : 'Delete'}
                          >
                            <TrashIcon className="admin-btn-icon" />
                          </button>
                          <a
                            href={`/z7k2m9/reports/${encodeURIComponent(r.id)}`}
                            className="admin-report-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View full report"
                            data-tooltip="View full report"
                          >
                            <ExternalLinkIcon className="admin-report-link-icon" />
                          </a>
                          {r.consent_share_social && (
                            <>
                              <button
                                type="button"
                                onClick={() => setReportForFacebook(r)}
                                className={`admin-fb-share-btn${r.facebook_posted_at ? ' admin-fb-share-btn-posted' : ''}`}
                                aria-label={r.facebook_posted_at ? 'Shared to Facebook' : 'Share to Facebook'}
                                data-tooltip={r.facebook_posted_at ? 'Shared to Facebook' : 'Share to Facebook'}
                              >
                                <FacebookIcon />
                              </button>
                            </>
                          )}
                                {r.consent_share_social && (
                            <button
                              type="button"
                              onClick={() => setReportForX(r)}
                              className="admin-x-share-btn"
                              aria-label="Share to X"
                              data-tooltip="Share to X"
                            >
                              <XIcon />
                            </button>
                          )}
                          {r.consent_share_social && (
                            <button
                              type="button"
                              onClick={() => setReportForThreads(r)}
                              className="admin-threads-share-btn"
                              aria-label="Share to Threads"
                              data-tooltip="Share to Threads"
                            >
                              <ThreadsIcon />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
                </>
              )}
            </div>
          )}
          {activeTab === 'approved' && (
            <div id="admin-panel-approved" role="tabpanel" aria-labelledby="admin-tab-approved" className="admin-tabs-panel">
              {loading ? (
                <p className="report-detail-loading">Loading reports…</p>
              ) : (
                <>
          <section className="admin-section" aria-labelledby="approved-heading">
            <h2 id="approved-heading" className="admin-section-title">
              Recently approved ({approvedTotal})
            </h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Report ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Type</th>
                    <th scope="col">Country</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedTotal === 0 ? (
                    <tr>
                      <td colSpan={5} className="admin-table-empty">No recently approved reports</td>
                    </tr>
                  ) : (
                    approvedItems.map((r) => (
                      <tr key={r.id} className="admin-report-item-approved">
                        <td className="admin-table-id" title={r.id}>
                          <span className="admin-report-id-short">{shortReportId(r.id)}</span>
                          <button
                            type="button"
                            onClick={() => copyReportIdToClipboard(r.id)}
                            className="admin-copy-id-btn"
                            aria-label={copiedId === r.id ? 'Copied!' : 'Copy full report ID'}
                            data-tooltip={copiedId === r.id ? 'Copied!' : 'Copy ID'}
                          >
                            {copiedId === r.id ? <CheckIcon className="admin-copy-id-icon" /> : <CopyIcon className="admin-copy-id-icon" />}
                          </button>
                        </td>
                        <td>{formatDate(r.created_at)}</td>
                        <td>{REPORT_TYPE_ICONS[r.report_type as keyof typeof REPORT_TYPE_ICONS] ?? '📋'} {REPORT_TYPE_LABELS[r.report_type as keyof typeof REPORT_TYPE_LABELS] ?? r.report_type}</td>
                        <td>{r.country_origin}</td>
                        <td className="admin-table-actions">
                          <a href={`/z7k2m9/reports/${encodeURIComponent(r.id)}`} className="admin-report-link" target="_blank" rel="noopener noreferrer" aria-label="View full report" data-tooltip="View full report"><ExternalLinkIcon className="admin-report-link-icon" /></a>
                          <a href={`/reports/?id=${encodeURIComponent(r.id)}`} target="_blank" rel="noopener noreferrer" className="admin-report-link" aria-label="View as public" data-tooltip="View as public"><GlobeIcon className="admin-report-link-icon" /></a>
                          {r.consent_share_social && (
                            <>
                              <button
                                type="button"
                                onClick={() => setReportForFacebook(r)}
                                className={`admin-fb-share-btn${r.facebook_posted_at ? ' admin-fb-share-btn-posted' : ''}`}
                                aria-label={r.facebook_posted_at ? 'Shared to Facebook' : 'Share to Facebook'}
                                data-tooltip={r.facebook_posted_at ? 'Shared to Facebook' : 'Share to Facebook'}
                              >
                                <FacebookIcon />
                              </button>
                            </>
                          )}
                                {r.consent_share_social && (
                            <button
                              type="button"
                              onClick={() => setReportForX(r)}
                              className="admin-x-share-btn"
                              aria-label="Share to X"
                              data-tooltip="Share to X"
                            >
                              <XIcon />
                            </button>
                          )}
                          {r.consent_share_social && (
                            <button
                              type="button"
                              onClick={() => setReportForThreads(r)}
                              className="admin-threads-share-btn"
                              aria-label="Share to Threads"
                              data-tooltip="Share to Threads"
                            >
                              <ThreadsIcon />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {approvedPages > 1 && (
              <nav className="admin-pagination" aria-label="Approved reports pagination">
                <span className="admin-pagination-info">Page {approvedPage} of {approvedPages}</span>
                <button type="button" onClick={() => setApprovedPage((p) => Math.max(1, p - 1))} disabled={approvedPage <= 1} className="admin-pagination-btn">Previous</button>
                <button type="button" onClick={() => setApprovedPage((p) => Math.min(approvedPages, p + 1))} disabled={approvedPage >= approvedPages} className="admin-pagination-btn">Next</button>
              </nav>
            )}
          </section>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {reportForFacebook && (
        <FacebookShareModal
          report={reportForFacebook}
          token={token}
          onClose={() => setReportForFacebook(null)}
          onPostedToFacebook={() => setRefreshKey((k) => k + 1)}
        />
      )}
      {reportForX && (
        <XShareModal
          report={reportForX}
          onClose={() => setReportForX(null)}
        />
      )}
      {reportForThreads && token && (
        <ThreadsShareModal
          report={reportForThreads}
          token={token}
          onClose={() => setReportForThreads(null)}
          onPostedToThreads={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
