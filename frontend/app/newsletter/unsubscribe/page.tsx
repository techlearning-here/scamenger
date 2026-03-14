import type { Metadata } from 'next';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-server';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Unsubscribe from newsletter',
  description: 'Unsubscribe from Scam Avenger newsletter.',
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteUrl}/newsletter/unsubscribe` },
};

type Props = { searchParams: Promise<{ token?: string }> };

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token?.trim()) {
    return (
      <article className="newsletter_page">
        <h1 className="newsletter_page_title">Unsubscribe</h1>
        <p>Missing unsubscribe link. Use the link from the bottom of our emails, or contact us to be removed.</p>
        <p><Link href="/newsletter/">Newsletter</Link> · <Link href="/">Home</Link></p>
      </article>
    );
  }

  if (!supabaseAdmin) {
    return (
      <article className="newsletter_page">
        <h1 className="newsletter_page_title">Unsubscribe</h1>
        <p>Unsubscribe is not configured. Please contact us to be removed from the list.</p>
        <p><Link href="/contact/">Contact</Link> · <Link href="/">Home</Link></p>
      </article>
    );
  }

  const { error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
    .eq('unsubscribe_token', token.trim());

  if (error) {
    return (
      <article className="newsletter_page">
        <h1 className="newsletter_page_title">Unsubscribe</h1>
        <p>This link may have expired or already been used. You can try again from the link in our latest email, or contact us.</p>
        <p><Link href="/contact/">Contact</Link> · <Link href="/">Home</Link></p>
      </article>
    );
  }

  return (
    <article className="newsletter_page">
      <h1 className="newsletter_page_title">You’re unsubscribed</h1>
      <p>You won’t receive further newsletter emails. You can resubscribe anytime from our <Link href="/newsletter/">newsletter page</Link>.</p>
      <p><Link href="/">Back to home</Link></p>
    </article>
  );
}
