'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getStoredAdminToken,
  clearStoredAdminToken,
  listContactMessages,
  getContactMessage,
  deleteContactMessage,
  type ContactMessageDto,
} from '@/data/admin/api';
import { TrashIcon } from '../components/SocialShareIcons';

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

export default function AdminMessagesPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<ContactMessageDto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ContactMessageDto | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    const t = getStoredAdminToken();
    setToken(t);
    if (!t) router.replace('/z7k2m9/login/');
  }, [router]);

  useEffect(() => {
    if (!token) return;
    setError(null);
    listContactMessages(token)
      .then((res) => {
        setMessages(res.items);
        setTotal(res.total);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load messages');
        if (err instanceof Error && err.message === 'Unauthorized') {
          clearStoredAdminToken();
          router.replace('/z7k2m9/login/');
        }
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  async function handleExpand(id: string) {
    if (!token) return;
    if (expandedId === id) {
      setExpandedId(null);
      setDetail(null);
      return;
    }
    setActionId(id);
    setError(null);
    try {
      const msg = await getContactMessage(id, token, true);
      setDetail(msg);
      setExpandedId(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load message');
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    if (!window.confirm('Permanently delete this message?')) return;
    setActionId(id);
    setError(null);
    try {
      await deleteContactMessage(id, token);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setTotal((t) => Math.max(0, t - 1));
      if (expandedId === id) {
        setExpandedId(null);
        setDetail(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setActionId(null);
    }
  }

  if (!token) return null;

  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <Link href="/z7k2m9/">Admin</Link>
        <span className="back-sep"> / </span>
        <span>Messages</span>
      </nav>
      <div className="admin-header">
        <h1 className="report-scam-title">Contact messages</h1>
        <Link href="/z7k2m9/" className="admin-logout-btn">Back to dashboard</Link>
      </div>
      <p className="report-scam-lead">
        Messages submitted via the contact form. Click a message to read it; mark as read and delete as needed.
      </p>
      {error && (
        <div className="report-scam-error" role="alert">{error}</div>
      )}
      {loading ? (
        <p className="report-detail-loading">Loading messages…</p>
      ) : messages.length === 0 ? (
        <p className="report-detail-not-found">No messages yet.</p>
      ) : (
        <section className="admin-section" aria-label="Contact messages">
          <p className="admin-stats-total">Total: <strong>{total}</strong></p>
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
                    onClick={() => handleExpand(m.id)}
                    disabled={actionId === m.id}
                    aria-expanded={expandedId === m.id}
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
                    onClick={() => handleDelete(m.id)}
                    disabled={actionId === m.id}
                    className="admin-report-delete-btn"
                    aria-label={actionId === m.id ? 'Deleting…' : 'Delete message'}
                    data-tooltip={actionId === m.id ? 'Deleting…' : 'Delete'}
                  >
                    <TrashIcon className="admin-btn-icon" />
                  </button>
                </div>
                {expandedId === m.id && detail?.id === m.id && (
                  <div className="admin-message-body">
                    {detail.name && <p><strong>Name:</strong> {detail.name}</p>}
                    {detail.email && <p><strong>Email:</strong> <a href={`mailto:${detail.email}`}>{detail.email}</a></p>}
                    <p><strong>Message:</strong></p>
                    <p className="admin-message-text">{detail.message}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
