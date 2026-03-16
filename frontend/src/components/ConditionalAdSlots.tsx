'use client';

import { usePathname } from 'next/navigation';

/** Paths where we do not show ads (index/landing pages). All other pages show top + bottom ads. */
const NO_ADS_PATHS = new Set([
  '/',
  '/tools',
  '/tools/',
  '/tools/books',
  '/tools/books/',
  '/stories',
  '/stories/',
]);

function useShowAds(): boolean {
  const pathname = usePathname();
  if (pathname == null) return false;
  const normalized = pathname.replace(/\/$/, '') || pathname;
  return !NO_ADS_PATHS.has(pathname) && !NO_ADS_PATHS.has(normalized);
}

interface AdSlotProps {
  client: string;
  slot: string;
}

/**
 * Top AdSense slot (below header, above content). Renders only on non-index pages.
 */
export function ConditionalAdTop({ client, slot }: AdSlotProps) {
  const showAds = useShowAds();
  if (!showAds) return null;
  return (
    <div className="layout_container ad_container ad_container_top">
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

/**
 * Bottom AdSense slot (below content, above footer). Renders only on non-index pages.
 */
export function ConditionalAdBottom({ client, slot }: AdSlotProps) {
  const showAds = useShowAds();
  if (!showAds) return null;
  return (
    <div className="layout_container ad_container">
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
