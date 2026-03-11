'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { COUNTRY_OPTIONS } from '@/data/reports/countries';
import { getCountryFromLocale } from '@/data/reports/countries';
import { getSupportSectionsForCountry, type SupportSection } from '@/data/emotional-support';

const DEFAULT_COUNTRY = 'US';

export interface EmotionalSupportClientProps {
  /** Initial country from URL (e.g. ?country=GB). Client will override with locale if not set. */
  countryFromUrl?: string | null;
}

/**
 * Renders the Emotional support page with country detection and a country selector.
 * Uses getCountryFromLocale() when no country is in the URL; user can change country via dropdown.
 */
export function EmotionalSupportClient({ countryFromUrl }: EmotionalSupportClientProps) {
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

  const sections = getSupportSectionsForCountry(country);
  const countryLabel = COUNTRY_OPTIONS.find((o) => o.value === country)?.label ?? 'Your region';

  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Emotional support</span>
      </nav>
      <h1 id="emotional-support-heading" className="report-scam-title">
        Emotional support &amp; victim resources
      </h1>
      <p className="report-scam-lead">
        Being targeted by a scam can be stressful and overwhelming. The links below offer <strong>confidential support</strong>—whether you need someone to talk to or practical help as a victim of fraud. Showing resources for <strong>{countryLabel}</strong>.
      </p>

      <div className="help-now-country-wrap form-group">
        <label htmlFor="emotional-support-country" className="form-optional">
          Change country / region
        </label>
        <select
          id="emotional-support-country"
          className="country-select form-control"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          aria-label="Select country or region for support links"
        >
          {COUNTRY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {sections.map((section: SupportSection) => (
        <section
          key={section.heading}
          className="emotional-support-section"
          aria-labelledby={`section-${section.heading.replace(/\s+/g, '-')}`}
        >
          <h2 id={`section-${section.heading.replace(/\s+/g, '-')}`} className="emotional-support-section-title">
            {section.heading}
          </h2>
          <p className="emotional-support-section-intro">{section.intro}</p>
          <ul className="help-now-list" aria-labelledby={`section-${section.heading.replace(/\s+/g, '-')}`}>
            {section.links.map((item) => (
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
        </section>
      ))}

      <p className="help-now-footer">
        <Link href={`/help-now${country !== DEFAULT_COUNTRY ? `?country=${country}` : ''}`}>Need help now? Report fraud</Link> · <Link href="/report/">Report a scam</Link> · <Link href="/">Home</Link>
      </p>
    </>
  );
}
