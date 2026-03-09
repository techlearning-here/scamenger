'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      setError('Sign-in is not configured.');
      return;
    }
    setSubmitting(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback/` : undefined,
        },
      });
      if (err) throw err;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send link');
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="report-detail-card" style={{ maxWidth: '28rem' }}>
        <h1 className="report-scam-title">Check your email</h1>
        <p>We sent a sign-in link to <strong>{email}</strong>. Click the link to sign in, then you can rate reports.</p>
        <p className="back"><Link href="/reports/">Back to reports</Link></p>
      </div>
    );
  }

  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Sign in</span>
      </nav>
      <h1 className="report-scam-title">Sign in to rate reports</h1>
      <p className="report-scam-lead">Enter your email and we’ll send you a one-time link to sign in. No password needed.</p>
      <form onSubmit={handleSubmit} className="report-scam-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitting}
            className="form-control"
            autoComplete="email"
          />
        </div>
        {error && <p className="report-scam-error" role="alert">{error}</p>}
        <div className="form-actions">
          <button type="submit" disabled={submitting} className="report-scam-submit">
            {submitting ? 'Sending…' : 'Send sign-in link'}
          </button>
          <Link href="/reports/">Cancel</Link>
        </div>
      </form>
    </>
  );
}
