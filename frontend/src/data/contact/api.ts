/**
 * Contact form API: submit message (stored for admin to view).
 */

const API_BASE =
  typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || '') : '';

export interface ContactSubmitPayload {
  name: string;
  email: string;
  message: string;
}

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

/**
 * Submit contact form. Message is stored and visible to admin in dashboard.
 */
export async function submitContactMessage(
  payload: ContactSubmitPayload,
): Promise<ContactMessageDto> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim(),
      message: payload.message.trim(),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Failed to send message');
  }
  return res.json();
}
