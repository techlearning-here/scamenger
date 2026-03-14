import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { supabaseServer } from '@/lib/supabase-server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TOPIC_VALUES = ['alerts', 'guides', 'digest', 'all'] as const;
const FREQUENCY_VALUES = ['weekly', 'monthly', 'important_only'] as const;

function generateUnsubscribeToken(): string {
  return randomBytes(24).toString('hex');
}

function parseTopic(value: unknown): 'alerts' | 'guides' | 'digest' | 'all' {
  return typeof value === 'string' && TOPIC_VALUES.includes(value as (typeof TOPIC_VALUES)[number])
    ? (value as (typeof TOPIC_VALUES)[number])
    : 'all';
}

function parseFrequency(value: unknown): 'weekly' | 'monthly' | 'important_only' {
  return typeof value === 'string' && FREQUENCY_VALUES.includes(value as (typeof FREQUENCY_VALUES)[number])
    ? (value as (typeof FREQUENCY_VALUES)[number])
    : 'weekly';
}

/**
 * POST /api/newsletter/subscribe
 * Body: { email: string, consent: true, name?: string, topic?: string, frequency?: string }
 * Consent required (GDPR). Stores in Supabase newsletter_subscribers when configured.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const consent = body?.consent === true;
    const name = typeof body?.name === 'string' ? body.name.trim() : undefined;
    const topic = parseTopic(body?.topic);
    const frequency = parseFrequency(body?.frequency);

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ message: 'Please agree to receive emails.' }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (supabaseServer) {
      const row: Record<string, unknown> = {
        email,
        name: name || null,
        unsubscribe_token: generateUnsubscribeToken(),
        consent_at: new Date().toISOString(),
        status: 'subscribed',
      };
      row.topic = topic;
      row.frequency = frequency;

      const { error } = await supabaseServer.from('newsletter_subscribers').insert(row);
      if (error) {
        if (error.code === '23505') {
          return NextResponse.json({ ok: true, message: 'Subscribed.' });
        }
        return NextResponse.json({ message: 'Subscription failed. Please try again later.' }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, message: 'Subscribed.' });
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  }
}
