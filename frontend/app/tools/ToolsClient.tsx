'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { COUNTRY_OPTIONS } from '@/data/reports/countries';
import { getCountryFromLocale } from '@/data/reports/countries';
import { getToolsForCountry, type ToolLink, type ToolSection } from '@/data/tools';

const DEFAULT_COUNTRY = 'US';

/** Favicon URL: our site favicon for internal links, Google favicon service for external. */
function getFaviconUrl(href: string, external: boolean): string | null {
  if (!external) {
    return '/favicon.ico';
  }
  if (href.startsWith('http')) {
    try {
      const hostname = new URL(href).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
      return null;
    }
  }
  return null;
}

/** Site name (hostname) for display; internal links show our site name like other tools. */
function getSiteName(href: string, external: boolean): string {
  if (external && href.startsWith('http')) {
    try {
      return new URL(href).hostname;
    } catch {
      return '';
    }
  }
  return 'Scamenger.com';
}

export type ToolTagFilter = 'prevent' | 'free' | 'forVictim' | 'report' | 'thirdParty' | 'important';

/** Returns true if item has any of the selected tags (derived from section + item). */
function toolMatchesTagFilter(
  item: ToolLink,
  section: ToolSection,
  activeFilters: Set<ToolTagFilter>
): boolean {
  if (activeFilters.size === 0) return true;
  const isPreventiveSection = section.heading.startsWith('Protect & avoid scams');
  const isRecoverySection = section.heading.startsWith('Recover');
  const isMixedSection = section.heading.startsWith('Identity & credit');
  const showPrevent = item.preventive ?? (isPreventiveSection || (isMixedSection && item.free));
  const showForVictim = item.forVictim ?? (isRecoverySection || (isMixedSection && !item.free));
  const showReport = item.forReporting ?? isRecoverySection;
  if (activeFilters.has('prevent') && showPrevent) return true;
  if (activeFilters.has('free') && item.free) return true;
  if (activeFilters.has('forVictim') && showForVictim) return true;
  if (activeFilters.has('report') && showReport) return true;
  if (activeFilters.has('thirdParty') && item.thirdParty) return true;
  if (activeFilters.has('important') && item.important) return true;
  return false;
}

export interface ToolsClientProps {
  /** Initial country from URL (e.g. ?country=GB). Client will override with locale if not set. */
  countryFromUrl?: string | null;
}

/**
 * Renders the Tools page: official tools and services by country (protect, recover, identity).
 */
export function ToolsClient({ countryFromUrl }: ToolsClientProps) {
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

  const sections = getToolsForCountry(country);
  const countryLabel = COUNTRY_OPTIONS.find((o) => o.value === country)?.label ?? 'Your region';

  const [tagFilters, setTagFilters] = useState<Set<ToolTagFilter>>(new Set());
  const [expandedBenefits, setExpandedBenefits] = useState<Set<string>>(new Set());
  const [compactView, setCompactView] = useState<boolean>(false);

  const totalToolCount = sections.reduce((sum, s) => sum + s.links.length, 0);
  const officialCount = sections.reduce((sum, s) => sum + s.links.filter((l) => !l.thirdParty).length, 0);
  const thirdPartyCount = totalToolCount - officialCount;

  const toggleTagFilter = (tag: ToolTagFilter) => {
    setTagFilters((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const toggleBenefits = (key: string) => {
    setExpandedBenefits((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  /** Suggested PDF filename when printing/saving the Tools page. */
  const PRINT_PDF_FILENAME_BASE = 'scamenger.com_tools_services';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('toolsCompactView');
    if (stored === 'true') setCompactView(true);
  }, []);

  const setCompact = (value: boolean) => {
    setCompactView(value);
    if (typeof window !== 'undefined') window.localStorage.setItem('toolsCompactView', String(value));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let previousTitle = '';
    const onBeforePrint = () => {
      previousTitle = document.title;
      document.title = PRINT_PDF_FILENAME_BASE;
    };
    const onAfterPrint = () => {
      if (previousTitle) document.title = previousTitle;
    };
    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
    };
  }, []);

  return (
    <div className={`tool-page-content ${compactView ? 'tool-page-content--compact' : ''}`}>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Tools</span>
      </nav>
      <header className="tool-page-hero">
        <h1 id="tools-heading" className="tool-page-title">
          Tools &amp; online services
        </h1>
        <p className="tool-page-intro">
          Trusted, official resources to <strong>protect yourself</strong>, <strong>recover after fraud</strong>, and <strong>safeguard your identity</strong>—all in one place. We’ve grouped them by region so you can quickly find the right government and consumer services. Stay ahead of scams, check a link or company before you act, or get step-by-step help when something goes wrong. Everything here is free to use.
        </p>
        <ul className="tool-page-highlights" aria-label="What you’ll find on this page">
          <li>Freeze credit, get your free credit report, and protect your identity</li>
          <li>Scam alerts and tips to stay informed and avoid fraud</li>
          <li>Check URLs, phone numbers, or firms before you act</li>
          <li>Report a scam to authorities and get step-by-step recovery help</li>
        </ul>
        <p className="tool-page-cta emotional-support-cta tool-intro-cta">
          <strong>Need to report a scam or get emergency support?</strong>{' '}
          <Link href="/help-now/">Need help now?</Link> lists emergency contacts and official reporting links by country.
        </p>
      </header>
      <div className="tool-tags-legend" aria-label="Meaning of tags on tool cards">
        <h2 className="tool-tags-legend-title">Tags and meanings</h2>
        <p className="tool-tags-legend-intro">Each tool may show one or more tags. Use them to find what you need:</p>
        <dl className="tool-tags-legend-list">
          <div className="tool-tags-legend-item">
            <dt><span className="tool-card-prevent-badge tool-tags-legend-badge" aria-hidden>Prevent</span></dt>
            <dd>Use before a scam — stay informed, check links or firms, and reduce the risk of becoming a victim.</dd>
          </div>
          <div className="tool-tags-legend-item">
            <dt><span className="tool-card-free-badge tool-tags-legend-badge" aria-hidden>Free</span></dt>
            <dd>Free to use; no payment required. Sign-up may be required for some tools.</dd>
          </div>
          <div className="tool-tags-legend-item">
            <dt><span className="tool-card-victim-badge tool-tags-legend-badge" aria-hidden>For victims</span></dt>
            <dd>For people who have already been scammed — recovery steps, support, and complaint options.</dd>
          </div>
          <div className="tool-tags-legend-item">
            <dt><span className="tool-card-report-badge tool-tags-legend-badge" aria-hidden>Report</span></dt>
            <dd>Use to report a scam to authorities or platforms and help warn others.</dd>
          </div>
          <div className="tool-tags-legend-item">
            <dt><span className="tool-card-important-star tool-tags-legend-badge" aria-hidden>★ Important</span></dt>
            <dd>Especially important or go-to tools — official, widely used, or highly recommended.</dd>
          </div>
          <div className="tool-tags-legend-item">
            <dt><span className="tool-card-third-party-badge tool-tags-legend-badge" aria-hidden>Third party</span></dt>
            <dd>Not run by government — independent, non-profit, or commercial service. Use your judgement.</dd>
          </div>
        </dl>
      </div>
      <div className="tool-how-to-guide" aria-label="How to use these tools">
        <h2 className="tool-how-to-title">How to use these tools</h2>
        <p className="tool-how-to-intro">Use the list below to find official and trusted services. In three steps:</p>
        <ol className="tool-how-to-list">
          <li><strong>Pick your region</strong> — Use the country selector so the list shows services for your area.</li>
          <li><strong>Filter by tag</strong> — Click Prevent, For victims, Report, or Free to show only matching tools.</li>
          <li><strong>Open a tool</strong> — Click a card to go to the official site or our report page (external links open in a new tab). Expand a card for “Why use this?” details.</li>
        </ol>
      </div>
      <div className="help-now-country-wrap form-group tool-country-block">
        <p className="tool-country-note">
          All links below are for <strong>{countryLabel}</strong>. Change the region if needed.
        </p>
        <label htmlFor="tools-country" className="form-optional">
          Change country / region
        </label>
        <select
          id="tools-country"
          className="country-select form-control"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          aria-label="Select country or region for tools and services"
        >
          {COUNTRY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <p className="tool-count-line" aria-live="polite">
        <strong>{totalToolCount}</strong> tools for {countryLabel}
        {thirdPartyCount > 0 && (
          <> · {officialCount} official, {thirdPartyCount} third party</>
        )}
      </p>
      <div className="tool-actions-row">
        <nav className="tool-jump-links" aria-label="Jump to section">
          <span className="tool-jump-label">Jump to:</span>
          {sections.map((section: ToolSection, index: number) => (
            <a key={section.heading} href={`#tools-section-${index}`} className="tool-jump-link">
              {section.heading.replace(' – tools/services', '')}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="tool-view-toggle"
          onClick={() => setCompact(!compactView)}
          aria-pressed={compactView}
          title={compactView ? 'Show full cards with descriptions' : 'Show compact list'}
        >
          {compactView ? 'Full view' : 'Compact view'}
        </button>
        <button type="button" onClick={handlePrint} className="tool-print-btn" aria-label="Print tool list" title="Print tool list">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9V2h12v7" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <path d="M6 14h12v8H6z" />
          </svg>
        </button>
      </div>
      <div className="tool-filter-wrap">
        <span className="tool-filter-label">Show tools with tag:</span>
        <div className="tool-filter-pills">
          {(['prevent', 'free', 'forVictim', 'report', 'thirdParty', 'important'] as const).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTagFilter(tag)}
              className={`tool-filter-pill ${tagFilters.has(tag) ? 'tool-filter-pill-on' : ''}`}
              aria-pressed={tagFilters.has(tag)}
            >
              {tag === 'forVictim' ? 'For victims' : tag === 'thirdParty' ? 'Third party' : tag === 'prevent' ? 'Prevent' : tag === 'report' ? 'Report' : tag === 'important' ? '★ Important' : 'Free'}
            </button>
          ))}
        </div>
        {tagFilters.size > 0 && (
          <button type="button" onClick={() => setTagFilters(new Set())} className="tool-filter-clear">
            Clear filter
          </button>
        )}
      </div>
      {sections.map((section: ToolSection, index: number) => {
        const isPreventiveSection = section.heading.startsWith('Protect & avoid scams');
        const isRecoverySection = section.heading.startsWith('Recover');
        const isMixedSection = section.heading.startsWith('Identity & credit');
        const filteredLinks = section.links.filter((item) =>
          toolMatchesTagFilter(item, section, tagFilters)
        );
        return (
        <section
          key={section.heading}
          className="emotional-support-section"
          aria-labelledby={`tools-section-${index}`}
        >
          <h2 id={`tools-section-${index}`} className="emotional-support-section-title">
            {section.heading}
          </h2>
          <p className="emotional-support-section-intro">{section.intro}</p>
          {isPreventiveSection && filteredLinks.length > 0 && (
            <p className="tool-section-cta" role="status">
              Try these tools to avoid becoming a victim and to fight back against scams and fraud.
            </p>
          )}
          {filteredLinks.length > 0 ? (
            <ul className="help-now-list tools-list" aria-label={section.heading}>
              {filteredLinks.map((item: ToolLink) => {
                const showPrevent = item.preventive ?? (isPreventiveSection || (isMixedSection && item.free));
                const showForVictim = item.forVictim ?? (isRecoverySection || (isMixedSection && !item.free));
                const showReport = item.forReporting ?? isRecoverySection;
                const faviconUrl = getFaviconUrl(item.href, item.external);
                const siteName = getSiteName(item.href, item.external);
                const benefitsKey = `${section.heading}-${item.label}-${item.href}`;
                const benefitsExpanded = expandedBenefits.has(benefitsKey);
                return (
                <li key={item.href + item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      className="help-now-card tool-card"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="tool-card-header">
                        <span className="tool-card-label-wrap">
                          <span className="help-now-card-label">
                            {faviconUrl && (
                              <img src={faviconUrl} alt="" className="tool-card-favicon" width={20} height={20} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            )}
                            {item.label}
                          </span>
                          {siteName && <span className="tool-card-site-name">{siteName}</span>}
                        </span>
                        <span className="tool-card-badges">
                          {item.important && (
                            <span className="tool-card-important-star" aria-label="Important tool" title="Important">★</span>
                          )}
                          {showPrevent && (
                            <span className="tool-card-prevent-badge" aria-label="Preventive tool – use to avoid becoming a victim">
                              Prevent
                            </span>
                          )}
                          {item.free && (
                            <span className="tool-card-free-badge" aria-label="Free to use">
                              Free
                            </span>
                          )}
                          {showForVictim && (
                            <span className="tool-card-victim-badge" aria-label="For scam victims – recovery and support">
                              For victims
                            </span>
                          )}
                          {showReport && (
                            <span className="tool-card-report-badge" aria-label="Use to report a scam">
                              Report
                            </span>
                          )}
                          {item.thirdParty && (
                            <span className="tool-card-third-party-badge" aria-label="Third party – not run by government">
                              Third party
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="help-now-card-desc">{item.description}</span>
                      {item.benefits && (
                        <div className={`tool-card-benefits-wrap ${benefitsExpanded ? 'is-expanded' : ''}`}>
                          <button
                            type="button"
                            className="tool-benefits-toggle"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleBenefits(benefitsKey);
                            }}
                            aria-expanded={benefitsExpanded}
                          >
                            Why use this?
                          </button>
                          <span className="tool-card-benefits" hidden={!benefitsExpanded}>{item.benefits}</span>
                        </div>
                      )}
                    </a>
                  ) : (
                    <Link href={item.href} className="help-now-card tool-card">
                      <span className="tool-card-header">
                        <span className="tool-card-label-wrap">
                          <span className="help-now-card-label">
                            {faviconUrl && (
                              <img src={faviconUrl} alt="" className="tool-card-favicon" width={20} height={20} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            )}
                            {item.label}
                          </span>
                          {siteName && <span className="tool-card-site-name">{siteName}</span>}
                        </span>
                        <span className="tool-card-badges">
                          {item.important && (
                            <span className="tool-card-important-star" aria-label="Important tool" title="Important">★</span>
                          )}
                          {showPrevent && (
                            <span className="tool-card-prevent-badge" aria-label="Preventive tool – use to avoid becoming a victim">
                              Prevent
                            </span>
                          )}
                          {item.free && (
                            <span className="tool-card-free-badge" aria-label="Free to use">
                              Free
                            </span>
                          )}
                          {showForVictim && (
                            <span className="tool-card-victim-badge" aria-label="For scam victims – recovery and support">
                              For victims
                            </span>
                          )}
                          {showReport && (
                            <span className="tool-card-report-badge" aria-label="Use to report a scam">
                              Report
                            </span>
                          )}
                          {item.thirdParty && (
                            <span className="tool-card-third-party-badge" aria-label="Third party – not run by government">
                              Third party
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="help-now-card-desc">{item.description}</span>
                      {item.benefits && (
                        <div className={`tool-card-benefits-wrap ${benefitsExpanded ? 'is-expanded' : ''}`}>
                          <button
                            type="button"
                            className="tool-benefits-toggle"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleBenefits(benefitsKey);
                            }}
                            aria-expanded={benefitsExpanded}
                          >
                            Why use this?
                          </button>
                          <span className="tool-card-benefits" hidden={!benefitsExpanded}>{item.benefits}</span>
                        </div>
                      )}
                    </Link>
                  )}
                </li>
              );})}
            </ul>
          ) : (
            <p className="emotional-support-section-intro">
              {tagFilters.size > 0
                ? 'No tools in this section match the selected tags. Try changing the filter or region.'
                : 'No specific links for this category in your region. Use the country selector to see another region, or check official government and consumer sites.'}
            </p>
          )}
        </section>
      );})}
      <p className="help-now-footer">
        <Link href="/help-now/">Need help now?</Link>
        {' · '}
        <Link href="/immediate-help/">Immediate response (0–24 hours)</Link>
        {' · '}
        <Link href="/emotional-support/">Emotional support</Link>
        {' · '}
        <Link href="/">Home</Link>
        {' · '}
        <Link href="/report/">Report a scam</Link>
      </p>
    </div>
  );
}
