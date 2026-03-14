'use client';

import { useEffect } from 'react';

/**
 * In-content AdSense unit for long-form pages (e.g. story article, scam guide).
 * Renders one ad and triggers AdSense fill on mount. Only renders when
 * NEXT_PUBLIC_ADSENSE_CLIENT and NEXT_PUBLIC_ADSENSE_SLOT_MID (or SLOT_MAIN) are set.
 */
export function AdUnitMid() {
  const client =
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_ADSENSE_CLIENT : '';
  const slotMid =
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID : '';
  const slotMain =
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_MAIN : '';
  const slot = slotMid || slotMain;

  useEffect(() => {
    if (!client || !slot) return;
    try {
      (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
    } catch {
      // AdSense script may not be loaded yet; ad may still fill when script runs
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <div className="layout_container ad_container ad_container_mid" aria-label="Advertisement">
      <ins
        className="adsbygoogle ad_block"
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
