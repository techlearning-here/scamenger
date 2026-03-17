'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { COUNTRY_OPTIONS } from '@/data/reports/countries';
import { getCountryFromLocale } from '@/data/reports/countries';
import type { HelpLink } from '@/data/help-now';
import {
  getAuthorityLinksForSituation,
  getCategoryForSlug,
  getChecklistSteps,
  getImmediateHelpScamOptions,
  type ChecklistStep,
} from '@/data/immediate-response';

const STORAGE_KEY_PREFIX = 'immediate-help-checklist';

function getStorageKey(country: string, slug: string): string {
  return `${STORAGE_KEY_PREFIX}-${country}-${slug || 'other'}`;
}

function loadCheckedIds(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveCheckedIds(key: string, ids: Set<string>): void {
  try {
    window.localStorage.setItem(key, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

const EVIDENCE_ITEMS = [
  { id: 'screenshots', label: 'Screenshots of messages, emails, or websites', doneKey: 'evidence_screenshots' },
  { id: 'urls', label: 'URLs or links you clicked', doneKey: 'evidence_urls' },
  { id: 'calllogs', label: 'Call logs or phone numbers', doneKey: 'evidence_calllogs' },
  { id: 'emails', label: 'Emails (forward or save full headers)', doneKey: 'evidence_emails' },
  { id: 'transactions', label: 'Transaction IDs, dates, and amounts', doneKey: 'evidence_transactions' },
];

/** Incident description sections in the order they appear in the final content. */
const INCIDENT_SECTIONS = [
  {
    id: 'what_happened',
    label: 'What happened',
    placeholder: 'Brief summary of the incident (e.g. received a call claiming to be the IRS demanding payment by gift cards)',
  },
  {
    id: 'when',
    label: 'When',
    placeholder: 'Date and time (e.g. 10 March 2025, around 2pm)',
  },
  {
    id: 'amount_lost',
    label: 'Amount lost / financial impact',
    placeholder: 'Amount of money lost, currency, and how you paid (e.g. $500 by gift cards, 200 GBP by bank transfer). Put "None" if no money lost.',
  },
  {
    id: 'contact_details',
    label: 'Contact details (scammer’s phone, email, website, name used)',
    placeholder: 'Phone number, email address, website URL, or name the person used',
  },
] as const;

function buildFinalIncidentContent(
  sectionValues: Record<string, string>,
  evidenceItemNotes: Record<string, string>,
  additionalNotes: string
): string {
  const parts: string[] = [];

  for (const section of INCIDENT_SECTIONS) {
    const value = (sectionValues[section.id] || '').trim();
    if (value) {
      parts.push(`${section.label}:\n${value}`);
    }
  }

  const evidenceBlock = EVIDENCE_ITEMS.map((e) => {
    const note = (evidenceItemNotes[e.id] || '').trim();
    if (!note) return '';
    return `${e.label}:\n${note}`;
  })
    .filter(Boolean)
    .join('\n\n');
  if (evidenceBlock) {
    parts.push('Evidence collected:\n' + evidenceBlock);
  }

  if (additionalNotes.trim()) {
    parts.push('Additional notes:\n' + additionalNotes.trim());
  }

  return parts.join('\n\n');
}

export function ImmediateHelpClient() {
  const [country, setCountry] = useState('US');
  const [scamSlug, setScamSlug] = useState('');
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [incidentSections, setIncidentSections] = useState<Record<string, string>>({});
  const [evidenceItemNotes, setEvidenceItemNotes] = useState<Record<string, string>>({});
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [evidenceDone, setEvidenceDone] = useState<Record<string, boolean>>({});

  const scamOptions = getImmediateHelpScamOptions();
  const category = scamSlug ? getCategoryForSlug(scamSlug) : null;
  const steps = getChecklistSteps(scamSlug || null, category);
  const authorityLinks = getAuthorityLinksForSituation(country, scamSlug || null);
  const storageKey = getStorageKey(country, scamSlug);

  useEffect(() => {
    const detected = getCountryFromLocale();
    if (detected) setCountry(detected);
  }, []);

  useEffect(() => {
    setCheckedIds(loadCheckedIds(storageKey));
  }, [storageKey]);

  const toggleStep = useCallback(
    (stepId: string) => {
      setCheckedIds((prev) => {
        const next = new Set(prev);
        if (next.has(stepId)) next.delete(stepId);
        else next.add(stepId);
        saveCheckedIds(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const toggleEvidence = useCallback((id: string) => {
    setEvidenceDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const setEvidenceItemNote = useCallback((id: string, value: string) => {
    setEvidenceItemNotes((prev) => ({ ...prev, [id]: value }));
  }, []);

  const setIncidentSection = useCallback((id: string, value: string) => {
    setIncidentSections((prev) => ({ ...prev, [id]: value }));
  }, []);

  const finalNotesValue = buildFinalIncidentContent(
    incidentSections,
    evidenceItemNotes,
    additionalNotes
  );

  const handleFinalNotesChange = useCallback(
    (value: string) => {
      if (value.includes('Additional notes:\n')) {
        const idx = value.indexOf('Additional notes:\n');
        const after = value.slice(idx + 'Additional notes:\n'.length).trim();
        setAdditionalNotes(after);
      } else {
        setAdditionalNotes(value.trim());
      }
    },
    []
  );

  const countryLabel = COUNTRY_OPTIONS.find((o) => o.value === country)?.label ?? 'Your region';

  const evidenceCount = EVIDENCE_ITEMS.filter((e) => evidenceDone[e.id]).length;

  return (
    <>
      <h1 id="immediate-help-heading" className="report-scam-title">
        Immediate response (0–24 hours)
      </h1>
      <p className="report-scam-lead">
        Use this page in the first hours after a scam. We&apos;ll give you a checklist, official reporting links for your situation, and a list of what evidence to collect.
      </p>

      <section className="immediate-help-form form-group" aria-labelledby="immediate-help-heading">
        <div className="immediate-help-fields">
          <div>
            <label htmlFor="immediate-help-country">Your country / region</label>
            <select
              id="immediate-help-country"
              className="form-control"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              aria-describedby="immediate-help-country-desc"
            >
              {COUNTRY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span id="immediate-help-country-desc" className="form-hint">
              We&apos;ll show the right agencies for {countryLabel}.
            </span>
          </div>
          <div>
            <label htmlFor="immediate-help-scam">What best describes what happened?</label>
            <select
              id="immediate-help-scam"
              className="form-control"
              value={scamSlug}
              onChange={(e) => setScamSlug(e.target.value)}
              aria-describedby="immediate-help-scam-desc"
            >
              {scamOptions.map((opt) => (
                <option key={opt.value || 'other'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span id="immediate-help-scam-desc" className="form-hint">
              We&apos;ll tailor the checklist and agency links.
            </span>
          </div>
        </div>
      </section>

      <section className="immediate-help-checklist" aria-labelledby="checklist-heading">
        <h2 id="checklist-heading" className="immediate-help-h2">Emergency action checklist</h2>
        <p className="immediate-help-intro">
          Work through these steps. Your progress is saved in this browser so you can come back.
        </p>
        <ul className="immediate-help-steps">
          {steps.map((step: ChecklistStep) => (
            <li key={step.id} className="immediate-help-step">
              <label className="immediate-help-step-label">
                <input
                  type="checkbox"
                  checked={checkedIds.has(step.id)}
                  onChange={() => toggleStep(step.id)}
                  className="immediate-help-step-checkbox"
                  aria-describedby={step.detail ? `step-detail-${step.id}` : undefined}
                />
                <span className="immediate-help-step-text">{step.label}</span>
              </label>
              {step.detail && (
                <p id={`step-detail-${step.id}`} className="immediate-help-step-detail">
                  {step.detail}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="immediate-help-authority" aria-labelledby="authority-heading">
        <h2 id="authority-heading" className="immediate-help-h2">Where to report — Authority Router</h2>
        <p className="immediate-help-intro">
          These are the main agencies for <strong>{countryLabel}</strong>
          {scamSlug ? ' for your situation.' : '.'} Report to as many as apply.
        </p>
        <ul className="help-now-list">
          {authorityLinks.map((item: HelpLink) => (
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

      <section className="immediate-help-evidence" aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" className="immediate-help-h2">Evidence collection wizard</h2>
        <p className="immediate-help-intro">
          Fill in the incident sections below in order, then tick and describe each evidence item. The final box at the bottom will combine everything in the right order for your report.
        </p>

        <div className="immediate-help-incident-sections" aria-labelledby="incident-desc-heading">
          <h3 id="incident-desc-heading" className="immediate-help-h3">Describe the incident (in order)</h3>
          {INCIDENT_SECTIONS.map((section) => (
            <div key={section.id} className="form-group immediate-help-incident-field">
              <label htmlFor={`incident-${section.id}`}>{section.label}</label>
              <textarea
                id={`incident-${section.id}`}
                className="form-control immediate-help-incident-input"
                rows={2}
                placeholder={section.placeholder}
                value={incidentSections[section.id] ?? ''}
                onChange={(e) => setIncidentSection(section.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        <p className="immediate-help-evidence-completeness" aria-live="polite">
          <strong>Checklist:</strong> {evidenceCount} of {EVIDENCE_ITEMS.length} items marked as collected.
        </p>
        <ul className="immediate-help-steps">
          {EVIDENCE_ITEMS.map((item) => (
            <li key={item.id} className="immediate-help-step immediate-help-evidence-item">
              <label className="immediate-help-step-label">
                <input
                  type="checkbox"
                  checked={!!evidenceDone[item.id]}
                  onChange={() => toggleEvidence(item.id)}
                  className="immediate-help-step-checkbox"
                />
                <span className="immediate-help-step-text">{item.label}</span>
              </label>
              <div className="immediate-help-evidence-note-wrap">
                <label htmlFor={`evidence-note-${item.id}`} className="visually-hidden">
                  Describe this evidence: {item.label}
                </label>
                <textarea
                  id={`evidence-note-${item.id}`}
                  className="form-control immediate-help-evidence-note"
                  rows={2}
                  placeholder="Describe this evidence (e.g. where saved, what it shows)"
                  value={evidenceItemNotes[item.id] ?? ''}
                  onChange={(e) => setEvidenceItemNote(item.id, e.target.value)}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="form-group immediate-help-additional-details">
          <label htmlFor="immediate-help-additional-details">Additional details</label>
          <p className="form-hint">
            Anything else to include (e.g. other dates, names, reference numbers). This is appended to your incident description below.
          </p>
          <textarea
            id="immediate-help-additional-details"
            className="form-control immediate-help-notes"
            rows={3}
            placeholder="Add any other details for your report…"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="immediate-help-notes">
            Your incident description — built from the sections above (editable)
          </label>
          <p className="form-hint">
            Content is built in order: what happened → when → amount lost → contact details → evidence collected → additional details. You can edit this box and use it when you report.
          </p>
          <textarea
            id="immediate-help-notes"
            className="form-control immediate-help-notes"
            rows={10}
            value={finalNotesValue}
            onChange={(e) => handleFinalNotesChange(e.target.value)}
            placeholder="Your incident description will appear here as you fill the sections above…"
          />
        </div>
      </section>

      <p className="help-now-footer">
        <Link href="/help-now/">Need help now? (all links)</Link>
        {' · '}
        <Link href="/emotional-support/">Emotional support</Link>
        {' · '}
        <Link href="/spot-and-avoid-scams/">Spot and avoid scams</Link>
        {' · '}
        <Link href="/">Home</Link>
      </p>
    </>
  );
}
