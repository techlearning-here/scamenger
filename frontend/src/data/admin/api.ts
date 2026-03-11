/**
 * Admin API: login and report moderation.
 */

const API_BASE =
  typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || '') : '';

const ADMIN_TOKEN_KEY = 'scamenger_admin_token';

export interface AdminReportDto {
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
  consent_share_social: boolean;
  created_at: string;
  rating_count: number;
  avg_credibility: number;
  avg_usefulness: number;
  avg_completeness: number;
  avg_relevance: number;
  status: 'pending' | 'approved' | 'rejected';
}

/** Paginated list response from GET /z7k2m9/reports */
export interface AdminReportsListResponse {
  items: AdminReportDto[];
  total: number;
  page: number;
  page_size: number;
}

/** Optional params for listing reports */
export interface ListAdminReportsParams {
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
  page_size?: number;
}

/** Stats: total approved and count by category (GET /z7k2m9/stats) */
export interface AdminApprovedStatsResponse {
  total_approved: number;
  by_category: { category: string | null; count: number }[];
}

export function getStoredAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setStoredAdminToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearStoredAdminToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

/**
 * Admin login. Returns access token on success.
 * From the browser, uses same-origin /api/z7k2m9/login so the server can encrypt the password when ENCRYPTION_KEY is set; the route forwards to the backend.
 */
export async function adminLogin(username: string, password: string): Promise<string> {
  const loginUrl =
    typeof window !== 'undefined' ? '/api/z7k2m9/login' : `${API_BASE}/z7k2m9/login`;
  const res = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Login failed');
  }
  const data = await res.json();
  return data.access_token;
}

/**
 * List reports (admin) with optional status filter and pagination. Requires Bearer token.
 */
export async function listAdminReports(
  token: string,
  params?: ListAdminReportsParams,
): Promise<AdminReportsListResponse> {
  const search = new URLSearchParams();
  if (params?.status) search.set('status', params.status);
  if (params?.page != null) search.set('page', String(params.page));
  if (params?.page_size != null) search.set('page_size', String(params.page_size));
  const qs = search.toString();
  const url = `${API_BASE}/z7k2m9/reports${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

/**
 * Get approved report stats: total count and counts by scam category. Requires Bearer token.
 */
export async function getApprovedStats(token: string): Promise<AdminApprovedStatsResponse> {
  const res = await fetch(`${API_BASE}/z7k2m9/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

/**
 * Approve a report (admin). Requires Bearer token.
 */
export async function approveReport(
  reportId: string,
  token: string,
): Promise<AdminReportDto> {
  const res = await fetch(`${API_BASE}/z7k2m9/reports/${encodeURIComponent(reportId)}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (res.status === 404) {
    const err = await res.json().catch(() => ({ detail: 'Report not found' }));
    throw new Error(err.detail || 'Report not found');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

/**
 * Reject a report (admin). Requires Bearer token.
 */
export async function rejectReport(
  reportId: string,
  token: string,
): Promise<AdminReportDto> {
  const res = await fetch(`${API_BASE}/z7k2m9/reports/${encodeURIComponent(reportId)}/reject`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (res.status === 404) {
    const err = await res.json().catch(() => ({ detail: 'Report not found' }));
    throw new Error(err.detail || 'Report not found');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

/**
 * Permanently delete a report (admin). Requires Bearer token.
 */
export async function deleteReport(reportId: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/z7k2m9/reports/${encodeURIComponent(reportId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (res.status === 404) {
    const err = await res.json().catch(() => ({ detail: 'Report not found' }));
    throw new Error(err.detail || 'Report not found');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
}

/**
 * Get full report by id (admin). Requires Bearer token. Returns full details for any status.
 */
export async function getAdminReport(
  reportId: string,
  token: string,
): Promise<AdminReportDto> {
  const res = await fetch(`${API_BASE}/z7k2m9/reports/${encodeURIComponent(reportId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (res.status === 404) {
    const err = await res.json().catch(() => ({ detail: 'Report not found' }));
    throw new Error(err.detail || 'Report not found');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

/** Fields that can be updated by admin (all optional). Consent flags are not included — admins cannot edit them. */
export interface AdminReportUpdateDto {
  country_origin?: string;
  report_type?: string;
  report_type_detail?: string | null;
  category?: string | null;
  lost_money?: boolean;
  lost_money_range?: string | null;
  narrative?: string | null;
  status?: 'pending' | 'approved' | 'rejected';
}

/**
 * Update report (admin). Requires Bearer token. Only provided fields are updated.
 */
export async function updateAdminReport(
  reportId: string,
  token: string,
  payload: AdminReportUpdateDto,
): Promise<AdminReportDto> {
  const res = await fetch(`${API_BASE}/z7k2m9/reports/${encodeURIComponent(reportId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (res.status === 404) {
    const err = await res.json().catch(() => ({ detail: 'Report not found' }));
    throw new Error(err.detail || 'Report not found');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

/** Contact message (admin view). */
export interface ContactMessageDto {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface ContactMessagesListResponse {
  items: ContactMessageDto[];
  total: number;
  page: number;
  page_size: number;
}

/** Site settings (admin). */
export interface SiteSettingsDto {
  show_facebook_consent: boolean;
  show_report_scam: boolean;
}

/** Get site settings. Admin. */
export async function getSettings(token: string): Promise<SiteSettingsDto> {
  const res = await fetch(`${API_BASE}/z7k2m9/settings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

/** Update site settings. Admin. Only provided fields are updated. */
export async function updateSettings(
  token: string,
  payload: { show_facebook_consent?: boolean; show_report_scam?: boolean },
): Promise<SiteSettingsDto> {
  const res = await fetch(`${API_BASE}/z7k2m9/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

/** Facebook posting status (admin). True when FACEBOOK_PAGE_ID and token are set. */
export async function getFacebookStatus(token: string): Promise<{ enabled: boolean }> {
  const res = await fetch(`${API_BASE}/z7k2m9/facebook/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

/** Post report summary to Scam Avenger Facebook Page. Admin. Optional message; if omitted backend builds anonymized summary. */
export async function postReportToFacebook(
  reportId: string,
  token: string,
  message?: string,
): Promise<{ post_id: string; permalink: string }> {
  const res = await fetch(`${API_BASE}/z7k2m9/reports/${encodeURIComponent(reportId)}/post-to-facebook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(message != null && message.trim() !== '' ? { message: message.trim() } : {}),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

/** List contact messages (admin). Optional filter by read. */
export async function listContactMessages(
  token: string,
  params?: { read?: boolean; page?: number; page_size?: number },
): Promise<ContactMessagesListResponse> {
  const search = new URLSearchParams();
  if (params?.read !== undefined) search.set('read', String(params.read));
  if (params?.page != null) search.set('page', String(params.page));
  if (params?.page_size != null) search.set('page_size', String(params.page_size));
  const qs = search.toString();
  const url = `${API_BASE}/z7k2m9/messages${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

/** Get one contact message by id (marks as read by default). Admin. */
export async function getContactMessage(
  messageId: string,
  token: string,
  markRead = true,
): Promise<ContactMessageDto> {
  const url = `${API_BASE}/z7k2m9/messages/${encodeURIComponent(messageId)}?mark_read=${markRead}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 401) throw new Error('Unauthorized');
  if (res.status === 404) throw new Error('Message not found');
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

/** Delete a contact message. Admin. */
export async function deleteContactMessage(
  messageId: string,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/z7k2m9/messages/${encodeURIComponent(messageId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (res.status === 404) throw new Error('Message not found');
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
}
