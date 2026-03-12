import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || '';
const ENCRYPTION_KEY_B64 = (process.env.ENCRYPTION_KEY || '').trim();

/**
 * Encrypt plaintext with AES-256-GCM. Returns base64(nonce_12 + ciphertext + tag_16).
 * Matches backend app.utils.crypto format for decryption.
 * Key must be base64 or base64url (32 bytes decoded).
 */
function encryptPassword(plaintext: string, keyB64: string): string {
  const normalized = keyB64.replace(/-/g, '+').replace(/_/g, '/');
  const key = Buffer.from(normalized, 'base64');
  if (key.length !== 32) throw new Error('ENCRYPTION_KEY must decode to 32 bytes');
  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([nonce, enc, tag]).toString('base64');
}

/**
 * POST /api/z7k2m9/login — proxy login to backend. If ENCRYPTION_KEY is set, encrypts password before forwarding.
 */
export async function POST(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { detail: 'API URL not configured' },
      { status: 503 },
    );
  }
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid JSON' }, { status: 400 });
  }
  const { username, password } = body;
  if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
    return NextResponse.json(
      { detail: 'username and password are required' },
      { status: 400 },
    );
  }

  let backendBody: { username: string; password?: string; password_encrypted?: string };
  if (ENCRYPTION_KEY_B64) {
    try {
      const encrypted = encryptPassword(password, ENCRYPTION_KEY_B64);
      backendBody = { username, password_encrypted: encrypted };
    } catch (e) {
      return NextResponse.json(
        { detail: 'Encryption failed' },
        { status: 500 },
      );
    }
  } else {
    backendBody = { username, password };
  }

  const url = `${BACKEND_URL.replace(/\/$/, '')}/z7k2m9/login`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backendBody),
    redirect: 'manual',
  });
  if (res.type === 'opaqueredirect' || (res.status >= 300 && res.status < 400)) {
    return NextResponse.json(
      { detail: 'Backend URL redirected. Set NEXT_PUBLIC_API_URL to the final backend URL (no trailing slash).' },
      { status: 502 },
    );
  }
  const data = await res.json().catch(() => ({ detail: res.statusText }));
  return NextResponse.json(data, { status: res.status });
}
