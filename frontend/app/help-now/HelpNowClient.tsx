'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { COUNTRY_OPTIONS } from '@/data/reports/countries';
import { getCountryFromLocale } from '@/data/reports/countries';
import { getHelpLinksForCountry, type HelpLink } from '@/data/help-now';

const DEFAULT_COUNTRY = 'US';

export interface HelpNowClientProps {
  /** Initial country from URL (e.g. ?country=GB). Client will override with locale if not set. */
  countryFromUrl?: string | null;
}

/**
 * Renders the Need help now? content with country detection and a country selector.
 * Uses getCountryFromLocale() when no country is in the URL; user can change country via dropdown.
 */
export function HelpNowClient({ countryFromUrl }: HelpNowClientProps) {
  const searchParams = useSearchParams();
  const urlCountry = countryFromUrl ?? searchParams.get('country');
  const [country, setCountry] = useState<string>(() => {
    if (urlCountry && COUNTRY_OPTIONS.some((o) => o.value === urlCountry.toUpperCase())) {
      return urlCountry.toUpperCase();
    }
    return DEFAULT_COUNTRY;
  });

  useEffect(() => {
    if (urlCountry) return;
    const detected = getCountryFromLocale();
    if (detected) setCountry(detected);
  }, [urlCountry]);

  const links = getHelpLinksForCountry(country);
  const countryLabel = COUNTRY_OPTIONS.find((o) => o.value === country)?.label ?? 'Your region';

  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Need help now?</span>
      </nav>
      <h1 id="help-now-heading" className="report-scam-title">
        Need help now?
      </h1>
      <p className="report-scam-lead">
        If you’ve been targeted by a scam or lost money, use these official links to report and get help. Showing links for{' '}
        <strong>{countryLabel}</strong>.
      </p>
      <p className="emotional-support-cta">
        <strong>Feeling overwhelmed?</strong>{' '}
        <Link href="/emotional-support/">Mental health hotlines and scam victim support resources</Link> are available.
      </p>
      <p className="emotional-support-cta">
        <strong>Just been scammed?</strong>{' '}
        <Link href="/immediate-help/">Use our Immediate response (0–24 hours) checklist and evidence collection list</Link> — step-by-step what to do right now.
      </p>
      <div className="help-now-country-wrap form-group">
        <label htmlFor="help-now-country" className="form-optional">
          Change country / region
        </label>
        <select
          id="help-now-country"
          className="country-select form-control"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          aria-label="Select country or region for help links"
        >
          {COUNTRY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <ul className="help-now-list" aria-labelledby="help-now-heading">
        {links.map((item: HelpLink) => (
          <li key={item.href + item.label}>
            {item.external ? (
              <a
                href={item.href}
                className="help-now-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="help-now-card-label">{item.label}</span>
                <span className="help-now-card-desc">{item.description}</span>
              </a>
            ) : (
              <Link href={item.href} className="help-now-card">
                <span className="help-now-card-label">{item.label}</span>
                <span className="help-now-card-desc">{item.description}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
      <p className="help-now-footer">
        <Link href="/immediate-help/">Immediate response (0–24 hours)</Link>
        {' · '}
        <Link href="/emotional-support/">Emotional support &amp; victim resources</Link>
        {' · '}
        <Link href="/">Back to home</Link>
        {' · '}
        <Link href="/report/">Report a scam</Link>
      </p>
    </>
  );
}
