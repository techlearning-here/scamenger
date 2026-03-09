/**
 * Types and API client for user-submitted scam reports.
 */

export type ReportType =
  | 'website'
  | 'phone'
  | 'crypto'
  | 'iban'
  | 'social_media'
  | 'whatsapp'
  | 'telegram'
  | 'discord'
  | 'other';

export type LostMoneyRange =
  | 'none'
  | 'under_100'
  | 'under_1000'
  | 'under_10000'
  | 'under_100000'
  | 'under_1000000'
  | 'over_1000000';

export const LOST_MONEY_RANGE_OPTIONS: { value: LostMoneyRange; label: string }[] = [
  { value: 'none', label: 'No money lost' },
  { value: 'under_100', label: 'Less than $100' },
  { value: 'under_1000', label: 'Less than $1,000' },
  { value: 'under_10000', label: 'Less than $10,000' },
  { value: 'under_100000', label: 'Less than $100,000' },
  { value: 'under_1000000', label: 'Less than $1,000,000' },
  { value: 'over_1000000', label: 'More than $1,000,000' },
];

export const LOST_MONEY_RANGE_LABELS: Record<LostMoneyRange, string> = {
  none: 'No money lost',
  under_100: 'Less than $100',
  under_1000: 'Less than $1,000',
  under_10000: 'Less than $10,000',
  under_100000: 'Less than $100,000',
  under_1000000: 'Less than $1,000,000',
  over_1000000: 'More than $1,000,000',
};

export interface ReportCreatePayload {
  country_origin: string;
  report_type: ReportType;
  report_type_detail?: string | null;
  category?: string | null;
  lost_money?: boolean;
  lost_money_range?: LostMoneyRange | null;
  narrative: string;
  consent_share_authorities?: boolean;
}

export interface ReportResponseDto {
  id: string;
  slug: string;
  country_origin: string;
  report_type: string;
  category: string | null;
  report_type_detail: string | null;
  lost_money: boolean;
  lost_money_range: string | null;
  narrative: string | null;
  consent_share_authorities: boolean;
  created_at: string;
  rating_count?: number;
  avg_credibility?: number;
  avg_usefulness?: number;
  avg_completeness?: number;
  avg_relevance?: number;
  /** Present when report is pending (submitter or public view). */
  status?: 'pending' | 'approved';
  /** Message e.g. waiting for approval; present when status is pending. */
  message?: string;
  /** Only present in create response; use in URL as view_token to see full report while pending. */
  submitter_view_token?: string;
}

/** Response when report exists but is not yet approved (no report content). */
export interface ReportPendingResponseDto {
  status: 'pending';
  message: string;
  id?: string;
}

export type GetReportByIdResponse = ReportResponseDto | ReportPendingResponseDto;

export interface RatePayloadDto {
  credibility: number;
  usefulness: number;
  completeness: number;
  relevance: number;
}

const API_BASE = typeof process !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || '')
  : '';

/**
 * Submit a new scam report (anonymous). Returns the created report including shareable id (use in URL as ?id=).
 */
export async function createReport(payload: ReportCreatePayload): Promise<ReportResponseDto> {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch a single report by its id (UUID).
 * Pass viewToken (from create response) to see full details while report is pending.
 */
export async function getReportById(
  id: string,
  viewToken?: string | null,
): Promise<GetReportByIdResponse | null> {
  const path = `/reports/${encodeURIComponent(id)}`;
  const q = viewToken ? `?view_token=${encodeURIComponent(viewToken)}` : '';
  const res = await fetch(`${API_BASE}${path}${q}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Submit a rating for a report (authenticated). Requires Bearer token from Supabase Auth.
 */
export async function submitRating(
  reportId: string,
  payload: RatePayloadDto,
  accessToken: string,
): Promise<ReportResponseDto> {
  const res = await fetch(`${API_BASE}/reports/${encodeURIComponent(reportId)}/rate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  website: 'Website / URL',
  phone: 'Phone / SMS',
  crypto: 'Crypto address',
  iban: 'IBAN / Bank account',
  social_media: 'Social media',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  discord: 'Discord',
  other: 'Other',
};

/** Label and placeholder for the type-specific detail input */
export const REPORT_TYPE_DETAIL_LABELS: Record<ReportType, { label: string; placeholder: string; inputMode: 'text' | 'url' | 'tel' }> = {
  website: { label: 'Website or URL', placeholder: 'https://example.com', inputMode: 'url' },
  phone: { label: 'Phone number', placeholder: 'e.g. +1 234 567 8900', inputMode: 'tel' },
  crypto: { label: 'Crypto address', placeholder: 'Wallet or contract address', inputMode: 'text' },
  iban: { label: 'IBAN or bank account', placeholder: 'e.g. IBAN or account identifier', inputMode: 'text' },
  social_media: { label: 'Profile or page link', placeholder: 'e.g. Facebook, Instagram, X profile URL or @handle', inputMode: 'url' },
  whatsapp: { label: 'Phone number or link', placeholder: 'e.g. +1 234 567 8900 or wa.me/...', inputMode: 'tel' },
  telegram: { label: 'Username or link', placeholder: 'e.g. @username or t.me/...', inputMode: 'text' },
  discord: { label: 'Username, server, or invite link', placeholder: 'e.g. username, server name, or discord.gg/...', inputMode: 'text' },
  other: { label: 'Details (optional)', placeholder: 'e.g. channel, handle, or link', inputMode: 'text' },
};

/** Hint to clarify that the field is for the scammer's info, not the user's */
export const REPORT_TYPE_DETAIL_SCAMMER_HINT: Record<ReportType, string> = {
  website: "Enter the scammer's website or URL, not your own.",
  phone: "Enter the scammer's phone number, not yours.",
  crypto: "Enter the scammer's crypto address or wallet, not yours.",
  iban: "Enter the scammer's IBAN or bank account, not yours.",
  social_media: "Enter the scammer's profile or page, not yours.",
  whatsapp: "Enter the scammer's WhatsApp number or link, not yours.",
  telegram: "Enter the scammer's Telegram username or link, not yours.",
  discord: "Enter the scammer's Discord username, server, or invite, not yours.",
  other: "Enter details that identify the scammer, not your own information.",
};

/** Short label for report_type_detail when displaying on report view */
export const REPORT_TYPE_DETAIL_SHORT_LABELS: Record<ReportType, string> = {
  website: 'Website',
  phone: 'Phone',
  crypto: 'Crypto address',
  iban: 'IBAN / Account',
  social_media: 'Social media',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  discord: 'Discord',
  other: 'Other',
};
