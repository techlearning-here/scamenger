'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  adminLogin,
  setStoredAdminToken,
} from '@/data/admin/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const token = await adminLogin(username.trim(), password);
      setStoredAdminToken(token);
      router.replace('/z7k2m9/');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : typeof err === 'string' ? err : 'Login failed',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Admin</span>
      </nav>
      <h1 className="report-scam-title">Admin login</h1>
      <p className="report-scam-lead">Sign in to moderate reports.</p>
      <form onSubmit={handleSubmit} className="report-scam-form" suppressHydrationWarning>
        <div className="form-group">
          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={submitting}
            className="form-control"
            autoComplete="username"
            suppressHydrationWarning
          />
        </div>
        <div className="form-group">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={submitting}
            className="form-control"
            autoComplete="current-password"
            suppressHydrationWarning
          />
        </div>
        {error && (
          <div className="report-scam-error" role="alert">
            {error}
          </div>
        )}
        <div className="form-actions">
          <button type="submit" disabled={submitting} className="report-scam-submit" suppressHydrationWarning>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
          <Link href="/">Cancel</Link>
        </div>
      </form>
    </>
  );
}
