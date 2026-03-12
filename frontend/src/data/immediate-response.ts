/**
 * Data for the Immediate response (0–24 hours) flow: emergency checklist steps
 * and authority routing hints by scam type/category.
 */

import type { HelpLink } from './help-now';
import { getHelpLinksForCountry } from './help-now';
import { getUsScamBySlug, getUsScamTypes } from './scams';
import type { ScamCategoryId } from './scams/types';

export interface ChecklistStep {
  id: string;
  label: string;
  detail?: string;
}

/** Generic steps that apply to most scams (used when no slug/category match). */
const GENERIC_CHECKLIST: ChecklistStep[] = [
  { id: 'stop', label: 'Stop further contact', detail: 'Do not send more money, codes, or personal information.' },
  { id: 'bank', label: 'Contact your bank or card issuer', detail: 'Report unauthorized charges and ask to freeze or dispute.' },
  { id: 'passwords', label: 'Change passwords', detail: 'For any accounts that may be compromised.' },
  { id: '2fa', label: 'Enable 2FA where possible', detail: 'Two-factor authentication adds a layer of protection.' },
  { id: 'save', label: 'Save evidence', detail: 'Screenshots, emails, URLs, call logs—see Evidence kit below.' },
  { id: 'report', label: 'Report to official agencies', detail: 'Use the links in the Authority Router section below.' },
];

/** Steps tailored by scam category. Key = ScamCategoryId. */
const CHECKLIST_BY_CATEGORY: Partial<Record<ScamCategoryId, ChecklistStep[]>> = {
  online: [
    { id: 'stop', label: 'Stop clicking links and do not reply', detail: 'Do not enter passwords, codes, or payment info.' },
    { id: 'passwords', label: 'Change passwords for affected accounts', detail: 'Use the real website or app—not links from the message.' },
    { id: '2fa', label: 'Enable 2FA on email and important accounts', detail: 'Helps prevent future takeovers.' },
    { id: 'bank', label: 'Contact bank if you entered payment or bank details', detail: 'Report possible compromise and dispute any unauthorized charges.' },
    { id: 'save', label: 'Save the message or email', detail: 'Screenshot or forward; note sender and date.' },
    { id: 'report', label: 'Report to FTC and IC3', detail: 'Use the Authority Router links below.' },
  ],
  financial: [
    { id: 'bank', label: 'Contact your bank or payment app immediately', detail: 'Report fraud, freeze cards, and dispute unauthorized transactions.' },
    { id: 'stop', label: 'Stop all further transfers or payments', detail: 'Do not send more money or "fees" to recover funds.' },
    { id: 'save', label: 'Save transaction details and messages', detail: 'Screenshots, dates, amounts, and recipient info.' },
    { id: 'passwords', label: 'Change passwords for banking and payment apps', detail: 'Enable 2FA if available.' },
    { id: 'report', label: 'Report to FTC, IC3, and CFPB if applicable', detail: 'Use the Authority Router links below.' },
  ],
  identity_benefits: [
    { id: 'freeze', label: 'Place a credit freeze', detail: 'Contact Equifax, Experian, and TransUnion to freeze your credit.' },
    { id: 'identitytheft', label: 'Go to IdentityTheft.gov', detail: 'Get a step-by-step recovery plan and report identity theft.' },
    { id: 'bank', label: 'Contact banks and card issuers', detail: 'Close or freeze compromised accounts.' },
    { id: 'passwords', label: 'Change all important passwords', detail: 'Email, banking, and enable 2FA.' },
    { id: 'save', label: 'Keep copies of all reports and correspondence', detail: 'Use the Evidence kit below.' },
    { id: 'report', label: 'Report to FTC and follow IdentityTheft.gov steps', detail: 'Use the Authority Router links below.' },
  ],
  government: [
    { id: 'stop', label: 'Stop contact—real agencies do not demand immediate payment', detail: 'Real IRS and government do not ask for gift cards, wire, or crypto.' },
    { id: 'bank', label: 'Contact bank if you sent money', detail: 'Report fraud and try to stop or reverse the payment.' },
    { id: 'save', label: 'Save phone number, emails, or messages', detail: 'Note exactly what was said and when.' },
    { id: 'report', label: 'Report to FTC and IRS (if impersonation)', detail: 'Use the Authority Router links below.' },
  ],
  impersonation: [
    { id: 'stop', label: 'Stop all contact and do not send more money', detail: 'Do not believe threats of arrest or demands for gift cards.' },
    { id: 'bank', label: 'Contact bank if you sent money', detail: 'Report fraud and dispute unauthorized charges.' },
    { id: 'save', label: 'Save evidence', detail: 'Phone number, emails, screenshots, dates.' },
    { id: 'report', label: 'Report to FTC and IC3', detail: 'Use the Authority Router links below.' },
  ],
  phone: [
    { id: 'stop', label: 'Hang up and do not call back on the number they gave', detail: 'Verify any claim by calling the real organization on a number you look up.' },
    { id: 'bank', label: 'Contact bank if you shared info or sent money', detail: 'Freeze cards and report fraud.' },
    { id: 'save', label: 'Note the number and what was said', detail: 'Save call logs if possible.' },
    { id: 'report', label: 'Report to FTC and IC3', detail: 'Use the Authority Router links below.' },
  ],
};

/** Slug-specific overrides (optional; category is used if no slug match). */
const CHECKLIST_BY_SLUG: Record<string, ChecklistStep[]> = {
  'identity-theft': [
    { id: 'identitytheft', label: 'Go to IdentityTheft.gov now', detail: 'Get your recovery plan and report identity theft.' },
    { id: 'freeze', label: 'Place a credit freeze with all three bureaus', detail: 'Equifax, Experian, TransUnion.' },
    { id: 'bank', label: 'Contact banks and card issuers', detail: 'Close or freeze compromised accounts.' },
    { id: 'passwords', label: 'Change passwords and enable 2FA', detail: 'For email, banking, and important accounts.' },
    { id: 'save', label: 'Keep copies of all reports', detail: 'Use the Evidence kit below.' },
    { id: 'report', label: 'Report to FTC and follow IdentityTheft.gov', detail: 'Use the Authority Router links below.' },
  ],
  phishing: [
    { id: 'stop', label: 'Do not click any more links or enter passwords', detail: 'Use the real website by typing the URL yourself.' },
    { id: 'passwords', label: 'Change your password for the affected account', detail: 'Log in via the real site or app, not the email link.' },
    { id: '2fa', label: 'Turn on 2FA for that account', detail: 'Helps prevent future takeover.' },
    { id: 'bank', label: 'Contact your bank if you entered bank or card details', detail: 'Report possible compromise.' },
    { id: 'save', label: 'Save the email or message', detail: 'Screenshot or forward; note sender and date.' },
    { id: 'report', label: 'Report to FTC and IC3', detail: 'Use the Authority Router links below.' },
  ],
};

/**
 * Returns the emergency checklist steps for the given scam slug and/or category.
 * Slug takes precedence, then category, then generic.
 */
export function getChecklistSteps(slug: string | null, category: ScamCategoryId | null): ChecklistStep[] {
  if (slug && CHECKLIST_BY_SLUG[slug]) return CHECKLIST_BY_SLUG[slug];
  if (category && CHECKLIST_BY_CATEGORY[category]) return CHECKLIST_BY_CATEGORY[category];
  return GENERIC_CHECKLIST;
}

/**
 * Returns help links for the country, optionally reordered so that links most
 * relevant to the scam type appear first (e.g. IdentityTheft.gov for identity theft).
 */
export function getAuthorityLinksForSituation(
  countryCode: string,
  scamSlug: string | null
): HelpLink[] {
  const links = getHelpLinksForCountry(countryCode);

  if (!scamSlug) return links;

  const slugLower = scamSlug.toLowerCase();
  const identitySlugs = ['identity-theft', 'identity-theft-tax-refund'];
  const financialSlugs = ['bank-zelle-transfer', 'fake-shopping', 'romance', 'pig-butchering', 'investment'];

  if (identitySlugs.some((s) => slugLower.includes(s))) {
    return reorderLinks(links, ['IdentityTheft.gov', 'FTC', 'IC3', 'CFPB']);
  }
  if (financialSlugs.some((s) => slugLower.includes(s))) {
    return reorderLinks(links, ['CFPB', 'FTC', 'IC3']);
  }
  return links;
}

function reorderLinks(links: HelpLink[], preferLabels: string[]): HelpLink[] {
  const result: HelpLink[] = [];
  const remaining = [...links];
  for (const prefer of preferLabels) {
    const idx = remaining.findIndex((l) => l.label.includes(prefer));
    if (idx !== -1) {
      result.push(remaining[idx]);
      remaining.splice(idx, 1);
    }
  }
  return result.length ? [...result, ...remaining] : links;
}

/** Options for the scam-type selector: slug + label. */
export function getImmediateHelpScamOptions(): { value: string; label: string }[] {
  const types = getUsScamTypes();
  const options = [{ value: '', label: 'Not sure / Other' }];
  types.forEach((s) => options.push({ value: s.slug, label: s.name }));
  return options;
}

/**
 * Resolves slug to category for checklist lookup when we only have slug.
 */
export function getCategoryForSlug(slug: string): ScamCategoryId | null {
  const scam = getUsScamBySlug(slug);
  return scam?.category ?? null;
}
