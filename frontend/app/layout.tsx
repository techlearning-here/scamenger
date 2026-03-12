import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { FabActions } from '@/components/FabActions';
import { SiteNav } from '@/components/SiteNav';
import { SocialLinks } from '@/components/SocialLinks';
import './globals.css';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const defaultOgImageFallback = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&h=630&auto=format&fit=crop';
const siteTitle = 'Scam & Fraud Awareness | Scam Avenger';
const siteDescription = 'Learn about scams and fraud. Free guides, awareness resources, and official links by country and scam type. Build awareness and get support — no sign-up required.';
const siteKeywords = 'scam awareness, fraud awareness, learn about scams, learn about fraud, scam guides, fraud guides, phishing awareness, identity theft awareness, consumer fraud, avoid scams';

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const adsenseSlotMain = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MAIN;
const adsenseSlotTop = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP;
const showAdsense = Boolean(adsenseClient && adsenseSlotMain);
const showTopAd = showAdsense && Boolean(adsenseSlotTop ?? adsenseSlotMain);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1b365d',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | Scam Avenger',
  },
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: 'Scam Avenger', url: siteUrl }],
  creator: 'Scam Avenger',
  publisher: 'Scam Avenger',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    siteName: 'Scam Avenger',
    locale: 'en_US',
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    images: [
      { url: defaultOgImageFallback, width: 1200, height: 630, alt: 'Scam and fraud awareness – Scam Avenger' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [defaultOgImageFallback],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    // Optional: add when you have them
    // google: 'google-site-verification-code',
    // yandex: 'yandex-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
        {showAdsense && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': `${siteUrl}/#website`,
                  url: siteUrl,
                  name: 'Scam Avenger',
                  description: siteDescription,
                  publisher: { '@id': `${siteUrl}/#organization` },
                  inLanguage: 'en-US',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/?q={search_term_string}` },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'Organization',
                  '@id': `${siteUrl}/#organization`,
                  name: 'Scam Avenger',
                  url: siteUrl,
                  logo: { '@type': 'ImageObject', url: `${siteUrl}/icon.png` },
                  description: siteDescription,
                },
                {
                  '@type': 'Service',
                  name: 'Scam & Fraud Awareness',
                  description: 'Learn about scams and fraud. Free guides, awareness resources, and official links by country and scam type. Share anonymously with no sign-up.',
                  provider: { '@id': `${siteUrl}/#organization` },
                  areaServed: { '@type': 'Country', name: 'United States' },
                  url: siteUrl,
                },
              ],
            }),
          }}
        />
        <header className="site_header">
          <div className="layout_container">
            <SiteNav />
          </div>
        </header>
        <main className="main">
          {showTopAd && (
            <div className="layout_container ad_container ad_container_top">
              <ins
                className="adsbygoogle ad_block"
                data-ad-client={adsenseClient}
                data-ad-slot={adsenseSlotTop ?? adsenseSlotMain}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          )}
          <div className="layout_container">
            {children}
          </div>
          {showAdsense && (
            <div className="layout_container ad_container">
              <ins
                className="adsbygoogle ad_block"
                data-ad-client={adsenseClient}
                data-ad-slot={adsenseSlotMain}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          )}
        </main>
        <footer className="site_footer">
          <div className="layout_container">
            <SocialLinks />
            <div className="footer_legal_mobile" aria-label="Legal and support">
              <details className="footer_legal_collapse">
                <summary className="footer_legal_summary">
                  <span className="footer_legal_summary_text">Emotional support &amp; legal</span>
                  <span className="footer_legal_summary_icon" aria-hidden="true">▾</span>
                </summary>
                <nav className="footer_legal_collapse_nav" aria-label="Legal">
                  <Link href="/emotional-support/">Emotional support</Link>
                  <Link href="/privacy/">Privacy Policy</Link>
                  <Link href="/terms/">Terms &amp; Conditions</Link>
                  <Link href="/disclaimer/">Disclaimer</Link>
                  <Link href="/content-guidelines/">Content Guidelines</Link>
                  <Link href="/notice-takedown/">Notice and Take Down</Link>
                </nav>
              </details>
            </div>
            <nav className="site_footer_legal footer_legal_desktop" aria-label="Legal">
              <Link href="/emotional-support/">Emotional support</Link>
              <Link href="/privacy/">Privacy Policy</Link>
              <Link href="/terms/">Terms &amp; Conditions</Link>
              <Link href="/disclaimer/">Disclaimer</Link>
              <Link href="/content-guidelines/">Content Guidelines</Link>
              <Link href="/notice-takedown/">Notice and Take Down</Link>
            </nav>
            <p className="disclaimer disclaimer-long">One free platform to learn about scams and fraud, get guided to the right place to report if you need to, and find support to recover. We help you build awareness and warn others.</p>
            <p className="disclaimer disclaimer-short">Free platform to learn, report, and recover. We help you build awareness and warn others.</p>
            <p className="copy">&copy; {new Date().getFullYear()} Scam Avenger. 100% free. Links go to official government and trusted sites.</p>
          </div>
        </footer>
        <FabActions />
        {showAdsense && (
          <Script id="adsense-push" strategy="afterInteractive">
            {`(function(){try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}})();`}
          </Script>
        )}
      </body>
    </html>
  );
}
