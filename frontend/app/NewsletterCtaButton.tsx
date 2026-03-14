'use client';

import { useRouter } from 'next/navigation';

/**
 * Button that navigates to the newsletter signup page. Used on homepage CTA (not a link so styling is consistent).
 */
export function NewsletterCtaButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="newsletter_cta_button"
      onClick={() => router.push('/newsletter/')}
    >
      Subscribe to newsletter
    </button>
  );
}
