'use client';

import Link from 'next/link';
import { useState } from 'react';

const API_SUBSCRIBE = '/api/newsletter/subscribe';

type Status = 'idle' | 'loading' | 'success' | 'error';

type Topic = 'alerts' | 'guides' | 'digest' | 'all';
type Frequency = 'weekly' | 'monthly' | 'important_only';

const TOPIC_OPTIONS: { value: Topic; label: string }[] = [
  { value: 'all', label: 'All (alerts, new guides, digest)' },
  { value: 'alerts', label: 'Scam alerts only' },
  { value: 'guides', label: 'New guides only' },
  { value: 'digest', label: 'Weekly digest only' },
];

const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'important_only', label: 'Important alerts only' },
];

interface NewsletterSignupProps {
  /** Compact layout for footer; full for dedicated page. */
  variant?: 'footer' | 'page';
}

/**
 * Newsletter signup form: email (required), optional name, optional topic/frequency (page variant).
 * Submits to POST /api/newsletter/subscribe. Mobile-friendly.
 */
const CONSENT_LABEL = 'I agree to receive scam tips and new guides by email.';

export function NewsletterSignup({ variant = 'footer' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [topic, setTopic] = useState<Topic>('all');
  const [frequency, setFrequency] = useState<Frequency>('weekly');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!consent) {
      setErrorMessage('Please agree to receive emails.');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch(API_SUBSCRIBE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          consent: true,
          ...(name.trim() ? { name: name.trim() } : {}),
          topic,
          frequency,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setErrorMessage((data as { message?: string }).message || 'Something went wrong. Please try again.');
        return;
      }
      setStatus('success');
      setEmail('');
      setName('');
      setTopic('all');
      setFrequency('weekly');
      setConsent(false);
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className={`newsletter_signup newsletter_signup--${variant}`} data-status="success">
        <p className="newsletter_signup_success">
          Thanks for subscribing. We&apos;ll send scam tips and new guides to your inbox.
        </p>
      </div>
    );
  }

  const isPage = variant === 'page';

  return (
    <div className={`newsletter_signup newsletter_signup--${variant}`} aria-label="Newsletter signup">
      <p className="newsletter_signup_lead">
        {isPage ? 'Get scam alerts and new guides in your inbox.' : 'Get scam alerts and new guides.'}
      </p>
      <form className="newsletter_signup_form" onSubmit={handleSubmit} noValidate>
        <div className="newsletter_signup_fields">
          <label htmlFor="newsletter-email" className="visually-hidden">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="newsletter_signup_input"
            autoComplete="email"
            disabled={status === 'loading'}
            required
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={errorMessage ? 'newsletter-error' : undefined}
          />
          {isPage && (
            <>
              <label htmlFor="newsletter-name" className="visually-hidden">
                Name (optional)
              </label>
              <input
                id="newsletter-name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (optional)"
                className="newsletter_signup_input"
                autoComplete="name"
                disabled={status === 'loading'}
              />
            </>
          )}
        </div>
        {isPage && (
          <div className="newsletter_signup_preferences">
            <div className="newsletter_signup_pref">
              <label htmlFor="newsletter-topic">What do you want to receive?</label>
              <select
                id="newsletter-topic"
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value as Topic)}
                className="newsletter_signup_select"
                disabled={status === 'loading'}
              >
                {TOPIC_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="newsletter_signup_pref">
              <label htmlFor="newsletter-frequency">How often?</label>
              <select
                id="newsletter-frequency"
                name="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="newsletter_signup_select"
                disabled={status === 'loading'}
              >
                {FREQUENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="newsletter_signup_fields">
          <button
            type="submit"
            className="newsletter_signup_submit"
            disabled={status === 'loading'}
            aria-busy={status === 'loading'}
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </div>
        <div className="newsletter_signup_consent">
          <input
            id="newsletter-consent"
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={status === 'loading'}
            aria-invalid={errorMessage && !consent ? true : undefined}
            aria-describedby={errorMessage ? 'newsletter-error' : undefined}
          />
          <label htmlFor="newsletter-consent" className="newsletter_signup_consent_label">
            {CONSENT_LABEL} See our <Link href="/privacy/">Privacy Policy</Link>.
          </label>
        </div>
        {errorMessage && (
          <p id="newsletter-error" className="newsletter_signup_error" role="alert">
            {errorMessage}
          </p>
        )}
      </form>
      <p className="newsletter_signup_privacy">
        You&apos;ll receive scam tips and new guides only. No spam; unsubscribe anytime.
      </p>
    </div>
  );
}
