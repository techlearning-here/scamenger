'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  createReport,
  REPORT_TYPE_LABELS,
  REPORT_TYPE_DETAIL_LABELS,
  REPORT_TYPE_DETAIL_SCAMMER_HINT,
  REPORT_TYPE_ICONS,
  LOST_MONEY_RANGE_OPTIONS,
  LOST_MONEY_RANGE_LABELS,
  type ReportCreatePayload,
  type ReportType,
  type LostMoneyRange,
} from '@/data/reports/api';
import { getConfig } from '@/data/config/api';
import { COUNTRY_OPTIONS, getCountryFromLocale } from '@/data/reports/countries';
import { SCAM_CATEGORY_LABELS, type ScamCategoryId } from '@/data/scams/types';

const CATEGORY_OPTIONS: { value: ScamCategoryId; label: string }[] = (
  Object.entries(SCAM_CATEGORY_LABELS) as [ScamCategoryId, string][]
).map(([value, label]) => ({ value, label }));

const NARRATIVE_MAX_LENGTH = 3000;

export function ReportFormClient() {
  const [countryOrigin, setCountryOrigin] = useState('');
  const [countryAutoSelected, setCountryAutoSelected] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('website');
  const [reportTypeDetail, setReportTypeDetail] = useState('');
  const [category, setCategory] = useState<ScamCategoryId | ''>('');
  const [lostMoneyRange, setLostMoneyRange] = useState<LostMoneyRange>('none');
  const [narrative, setNarrative] = useState('');
  const [consentShareSocial, setConsentShareSocial] = useState(false);
  const [showFacebookConsentControl, setShowFacebookConsentControl] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detected = getCountryFromLocale();
    if (detected && !countryOrigin) {
      setCountryOrigin(detected);
      setCountryAutoSelected(true);
    }
  }, []);

  useEffect(() => {
    getConfig().then((c) => setShowFacebookConsentControl(c.show_facebook_consent));
  }, []);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    if (!countryOrigin.trim()) {
      setError('Please select the country of scam origin.');
      setShowPreview(false);
      return;
    }
    if (!narrative.trim()) {
      setError('Please describe what happened.');
      setShowPreview(false);
      return;
    }
    setSubmitting(true);
    try {
      const payload: ReportCreatePayload = {
        country_origin: countryOrigin.trim(),
        report_type: reportType,
        report_type_detail: reportTypeDetail.trim() || null,
        category: category || null,
        lost_money_range: lostMoneyRange,
        narrative: narrative.trim(),
        consent_share_social: showFacebookConsentControl === true ? consentShareSocial : false,
      };
      const report = await createReport(payload);
      const params = new URLSearchParams({ id: report.id });
      if (report.submitter_view_token) params.set('view_token', report.submitter_view_token);
      window.location.href = `/reports/?${params.toString()}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handlePreview() {
    setError(null);
    if (!countryOrigin.trim()) {
      setError('Please select the country of scam origin.');
      return;
    }
    if (!narrative.trim()) {
      setError('Please describe what happened.');
      return;
    }
    setShowPreview(true);
  }

  return (
    <>
      {error && (
        <div className="report-scam-error" role="alert">
          {error}
        </div>
      )}
      {showPreview ? (
        <div className="report-preview-card" aria-label="Report preview">
          <h2 className="report-preview-title">Review your report</h2>
          <p className="report-preview-intro">Check the details below. You can go back to edit or submit.</p>
          <dl className="report-detail-meta report-preview-meta">
            <div className="report-detail-meta-row">
              <dt className="report-detail-meta-label">Country of scam origin</dt>
              <dd className="report-detail-meta-value">
                {COUNTRY_OPTIONS.find((o) => o.value === countryOrigin)?.label ?? countryOrigin}
              </dd>
            </div>
            {category && (
              <div className="report-detail-meta-row">
                <dt className="report-detail-meta-label">Scam category</dt>
                <dd className="report-detail-meta-value">{SCAM_CATEGORY_LABELS[category] ?? category}</dd>
              </div>
            )}
            <div className="report-detail-meta-row">
              <dt className="report-detail-meta-label">Type</dt>
              <dd className="report-detail-meta-value">
                {REPORT_TYPE_ICONS[reportType] ?? '📋'} {REPORT_TYPE_LABELS[reportType]}
              </dd>
            </div>
            {reportTypeDetail.trim() && (
              <div className="report-detail-meta-row">
                <dt className="report-detail-meta-label">{REPORT_TYPE_DETAIL_LABELS[reportType].label}</dt>
                <dd className="report-detail-meta-value">{reportTypeDetail.trim()}</dd>
              </div>
            )}
            <div className="report-detail-meta-row">
              <dt className="report-detail-meta-label">I lost money</dt>
              <dd className="report-detail-meta-value">{LOST_MONEY_RANGE_LABELS[lostMoneyRange]}</dd>
            </div>
            <div className="report-detail-meta-row">
              <dt className="report-detail-meta-label">What happened?</dt>
              <dd className="report-detail-meta-value report-preview-narrative">{narrative.trim()}</dd>
            </div>
            {showFacebookConsentControl === true && (
            <div className="report-detail-meta-row">
              <dt className="report-detail-meta-label">Consent share on social (e.g. Facebook, X)</dt>
              <dd className="report-detail-meta-value">{consentShareSocial ? 'Yes' : 'No'}</dd>
            </div>
            )}
          </dl>
          <div className="form-actions report-preview-actions">
            <button type="button" onClick={() => setShowPreview(false)} className="report-scam-preview-back">
              Back to edit
            </button>
            <button type="button" onClick={() => handleSubmit()} disabled={submitting} className="report-scam-submit">
              {submitting ? 'Submitting…' : 'Submit report'}
            </button>
            <Link href="/" className="report-scam-cancel">
              Cancel
            </Link>
          </div>
        </div>
      ) : (
    <form onSubmit={handleSubmit} className="report-scam-form" aria-labelledby="report-scam-heading">
      <p className="report-scam-intro">
        Report anonymously. No account needed—we don’t ask for your name or email. Your report gets a shareable link so you can share it with others or authorities.
      </p>
      <p className="report-scam-pii-note" role="note">
        Please avoid including any personally identifiable information (e.g. your full name, address, phone number, or email) in your report. Describe what happened without revealing details that could identify you or others.
      </p>

      <div className="form-group">
        <label htmlFor="country_origin">
          Country of scam origin <span className="required">*</span>
        </label>
        <select
          id="country_origin"
          value={countryOrigin}
          onChange={(e) => {
            setCountryOrigin(e.target.value);
            setCountryAutoSelected(false);
          }}
          required
          disabled={submitting}
          className="form-control"
        >
          <option value="">Select country</option>
          {COUNTRY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {countryAutoSelected && (
          <p className="form-hint form-hint-autodetect" role="note">
            We’ve pre-selected a country based on your browser. You can change it if the scam originated elsewhere.
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category">Scam category (optional)</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory((e.target.value || '') as ScamCategoryId | '')}
          disabled={submitting}
          className="form-control"
        >
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="report_type">
          Report type <span className="required">*</span>
        </label>
        <select
          id="report_type"
          value={reportType}
          onChange={(e) => setReportType(e.target.value as ReportType)}
          required
          disabled={submitting}
          className="form-control"
        >
          {(Object.entries(REPORT_TYPE_LABELS) as [ReportType, string][]).map(([value, label]) => (
            <option key={value} value={value}>
              {REPORT_TYPE_ICONS[value]} {label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="report_type_detail">
          {REPORT_TYPE_DETAIL_LABELS[reportType].label} <span className="form-optional">(optional)</span>
        </label>
        <p className="form-hint form-hint-scammer" id="report_type_detail_scammer_hint" role="note">
          {REPORT_TYPE_DETAIL_SCAMMER_HINT[reportType]}
        </p>
        <input
          id="report_type_detail"
          type={reportType === 'website' ? 'url' : 'text'}
          inputMode={REPORT_TYPE_DETAIL_LABELS[reportType].inputMode}
          value={reportTypeDetail}
          onChange={(e) => setReportTypeDetail(e.target.value)}
          placeholder={REPORT_TYPE_DETAIL_LABELS[reportType].placeholder}
          maxLength={2000}
          disabled={submitting}
          className="form-control"
          aria-describedby="report_type_detail_scammer_hint"
        />
      </div>

      <div className="form-group">
        <label htmlFor="lost_money_range">I lost money in this scam</label>
        <select
          id="lost_money_range"
          value={lostMoneyRange}
          onChange={(e) => setLostMoneyRange(e.target.value as LostMoneyRange)}
          disabled={submitting}
          className="form-control"
        >
          {LOST_MONEY_RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="narrative">
          What happened? <span className="required">*</span>
        </label>
        <p className="form-hint">Maximum {NARRATIVE_MAX_LENGTH.toLocaleString()} characters.</p>
        <textarea
          id="narrative"
          value={narrative}
          onChange={(e) => setNarrative(e.target.value)}
          placeholder="Describe the incident: how you got in contact, what happened, and any details that might help others."
          rows={4}
          maxLength={NARRATIVE_MAX_LENGTH}
          required
          disabled={submitting}
          className="form-control form-control-textarea"
          aria-describedby="narrative-count narrative-warning"
        />
        <p id="narrative-count" className="form-char-count" aria-live="polite">
          {narrative.length.toLocaleString()} / {NARRATIVE_MAX_LENGTH.toLocaleString()} characters
        </p>
        {narrative.length >= NARRATIVE_MAX_LENGTH && (
          <p id="narrative-warning" className="form-char-count-warning" role="alert">
            Maximum length reached. You cannot add more characters.
          </p>
        )}
      </div>

      {showFacebookConsentControl === true && (
      <div className="form-group form-group-switch">
        <span className="form-switch-label" id="consent_share_social_label">
          Do you want an anonymized summary of this report posted on Scam Avenger&apos;s Facebook and X (Twitter) pages? <span className="form-optional">(optional)</span>
        </span>
        <label className="form-switch-wrap" htmlFor="consent_share_social_switch" aria-labelledby="consent_share_social_label">
          <input
            id="consent_share_social_switch"
            type="checkbox"
            className="form-switch-input"
            checked={consentShareSocial}
            onChange={(e) => setConsentShareSocial(e.target.checked)}
            disabled={submitting}
          />
          <span className="form-switch-ends">
            <span className="form-switch-no">No</span>
            <span className="form-switch-track" aria-hidden="true">
              <span className="form-switch-knob" />
            </span>
            <span className="form-switch-yes">Yes</span>
          </span>
        </label>
      </div>
      )}

      <p className="report-scam-disclaimer" role="note">
        <strong>Disclaimer:</strong> We will use this scam report for auditing and reporting purposes only. If you wish to report this scam to law enforcement or other authorities, please contact them directly.
      </p>

      <div className="form-actions">
        <button type="button" onClick={handlePreview} disabled={submitting} className="report-scam-preview-btn">
          Preview
        </button>
        <button type="submit" disabled={submitting} className="report-scam-submit">
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
        <Link href="/" className="report-scam-cancel">
          Cancel
        </Link>
      </div>
    </form>
      )}
    </>
  );
}
