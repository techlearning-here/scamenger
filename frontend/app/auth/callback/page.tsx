'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    if (!supabase) {
      setStatus('error');
      return;
    }
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (!hash) {
      router.replace('/reports/');
      return;
    }
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (!accessToken || !refreshToken) {
      setStatus('error');
      return;
    }
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(() => {
        setStatus('ok');
        window.location.replace('/reports/');
      })
      .catch(() => setStatus('error'));
  }, [router]);

  if (status === 'error') {
    return (
      <div className="report-detail-not-found">
        <p>Sign-in link invalid or expired.</p>
        <Link href="/login/">Try again</Link>
      </div>
    );
  }

  return <div className="report-detail-loading">Signing you in…</div>;
}
