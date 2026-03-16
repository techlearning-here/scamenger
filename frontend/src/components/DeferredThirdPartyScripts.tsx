'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

const DEFER_MS = 4000;

interface DeferredThirdPartyScriptsProps {
  showGa: boolean;
  gaId: string;
  adsenseClient: string;
  loadAdsenseScript: boolean;
  showAdsense: boolean;
}

/**
 * Loads GTM and AdSense only after first user interaction (click, scroll, keydown) or after DEFER_MS.
 * Keeps long main-thread tasks from these scripts out of the initial TBT window.
 */
export function DeferredThirdPartyScripts({
  showGa,
  gaId,
  adsenseClient,
  loadAdsenseScript,
  showAdsense,
}: DeferredThirdPartyScriptsProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      setShouldLoad(true);
    };

    const opts = { passive: true, once: true };
    window.addEventListener('click', load, opts);
    window.addEventListener('scroll', load, opts);
    window.addEventListener('keydown', load, opts);
    const t = window.setTimeout(load, DEFER_MS);

    return () => {
      window.removeEventListener('click', load);
      window.removeEventListener('scroll', load);
      window.removeEventListener('keydown', load);
      window.clearTimeout(t);
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <>
      {loadAdsenseScript && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      )}
      {showAdsense && (
        <Script id="adsense-push" strategy="lazyOnload">
          {`(function(){try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}})();`}
        </Script>
      )}
      {showGa && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="lazyOnload"
          />
          <Script id="ga-config" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
    </>
  );
}
