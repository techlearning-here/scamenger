import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';
import { ConditionalAdBottom, ConditionalAdTop } from '@/components/ConditionalAdSlots';
import { DeferredThirdPartyScripts } from '@/components/DeferredThirdPartyScripts';
import { FabActions } from '@/components/FabActions';
import { SiteNav } from '@/components/SiteNav';
import { SocialLinks } from '@/components/SocialLinks';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: true,
  variable: '--font-sans',
});

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const defaultOgImageFallback = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&h=630&auto=format&fit=crop';
const siteTitle = 'Scam & Fraud Awareness | Scam Avenger';
const siteDescription = 'Learn about scams and fraud. Free guides, awareness resources, and official links by country and scam type. Build awareness and get support — no sign-up required.';
const siteKeywords = 'scam awareness, fraud awareness, learn about scams, learn about fraud, scam guides, fraud guides, phishing awareness, identity theft awareness, consumer fraud, avoid scams';

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const showGa = Boolean(gaMeasurementId);

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '';
const adsenseSlotMain = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MAIN ?? '';
const adsenseSlotTop = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? adsenseSlotMain;
/** Load AdSense script when publisher ID is set (for verification and/or ads). */
const loadAdsenseScript = Boolean(adsenseClient);
/** Show ad slots only when we have both client and at least one slot. */
const showAdsense = Boolean(adsenseClient && adsenseSlotMain);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1b365d',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Scam Avenger',
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    // yandex: 'yandex-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }, '/icon.png'],
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
    <html lang="en" className={`${dmSans.variable} ${dmSans.className}`} suppressHydrationWarning>
      <head>
        {adsenseClient ? (
          <meta name="google-adsense-account" content={adsenseClient} />
        ) : null}
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
                  alternateName: 'Scamenger',
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
          {showAdsense && <ConditionalAdTop client={adsenseClient} slot={adsenseSlotTop} />}
          <div className="layout_container">
            {children}
          </div>
          {showAdsense && <ConditionalAdBottom client={adsenseClient} slot={adsenseSlotMain} />}
        </main>
        <footer className="site_footer">
          <div className="layout_container">
            <SocialLinks />
            <div className="footer_legal_mobile" aria-label="Legal and support">
              <details className="footer_legal_collapse">
                <summary className="footer_legal_summary">
                  <span className="footer_legal_summary_text">Emotional support &amp; legal</span>
                  <span className="footer_legal_summary_icon" aria-hidden="true" suppressHydrationWarning />
                </summary>
                <nav className="footer_legal_collapse_nav" aria-label="Legal">
                  <Link href="/emotional-support/">Emotional support</Link>
                  <Link href="/spot-and-avoid-scams/">Spot and avoid scams</Link>
                  <Link href="/newsletter/">Newsletter</Link>
                  <Link href="/privacy/">Privacy Policy</Link>
                  <Link href="/terms/">Terms &amp; Conditions</Link>
                  <Link href="/disclaimer/">Disclaimer</Link>
                  <Link href="/content-guidelines/">Content Guidelines</Link>
                  <Link href="/notice-takedown/">Notice and Take Down</Link>
                  <Link href="/site-map/">Sitemap</Link>
                </nav>
              </details>
            </div>
            <nav className="site_footer_legal footer_legal_desktop" aria-label="Legal">
              <Link href="/emotional-support/">Emotional support</Link>
              <Link href="/spot-and-avoid-scams/">Spot and avoid scams</Link>
              <Link href="/newsletter/">Newsletter</Link>
              <Link href="/privacy/">Privacy Policy</Link>
              <Link href="/terms/">Terms &amp; Conditions</Link>
              <Link href="/disclaimer/">Disclaimer</Link>
              <Link href="/content-guidelines/">Content Guidelines</Link>
              <Link href="/notice-takedown/">Notice and Take Down</Link>
              <Link href="/site-map/">Sitemap</Link>
            </nav>
            <p className="disclaimer disclaimer-long">One free platform to learn about scams and fraud, get guided to the right place to report if you need to, and find support to recover. We help you build awareness and warn others.</p>
            <p className="disclaimer disclaimer-short">Free platform to learn, report, and recover. We help you build awareness and warn others.</p>
            <p className="copy">&copy; {new Date().getFullYear()} Scam Avenger. 100% free. Links go to official government and trusted sites.</p>
          </div>
        </footer>
        <FabActions />
        {(showGa || loadAdsenseScript || showAdsense) && (
          <DeferredThirdPartyScripts
            showGa={showGa}
            gaId={gaMeasurementId ?? ''}
            adsenseClient={adsenseClient}
            loadAdsenseScript={loadAdsenseScript}
            showAdsense={showAdsense}
          />
        )}
      </body>
    </html>
  );
}
