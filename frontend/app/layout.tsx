import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { FabActions } from '@/components/FabActions';
import { NavReportScamLink } from '@/components/NavReportScamLink';
import { SocialLinks } from '@/components/SocialLinks';
import './globals.css';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const defaultOgImageFallback = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&h=630&auto=format&fit=crop';
const siteTitle = 'Report Scams & Fraud | Scam Avenger';
const siteDescription = 'Report scams and fraud. Free guides with official reporting links by country and scam type. No sign-up required.';
const siteKeywords = 'where to report scam, where to report fraud, report scam, report fraud, report phishing, identity theft report, consumer fraud report, scam reporting, fraud reporting, official scam report';

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
      { url: defaultOgImageFallback, width: 1200, height: 630, alt: 'Report scams and fraud – Scam Avenger' },
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
                  name: 'Scam & Fraud Reporting Guides',
                  description: 'Free guides on where to report scams and fraud. Official reporting links by country and scam type. Report anonymously with no sign-up.',
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
            <nav className="site_nav" aria-label="Main">
              <Link href="/" className="site_nav_logo" aria-label="Scam Avenger – Home">
                <Image src="/icon.png" alt="" width={40} height={40} className="site_nav_logo_img" />
                <span className="site_nav_logo_text">Scam Avenger</span>
              </Link>
              <Link href="/">Home</Link>
              <Link href="/lookup-report/">Look up report</Link>
              <Link href="/emotional-support/">Emotional support</Link>
              <Link href="/news/">News</Link>
              <Link href="/about/">About</Link>
              <Link href="/contact/">Contact</Link>
              <NavReportScamLink />
            </nav>
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
            <nav className="site_footer_legal" aria-label="Legal">
              <Link href="/emotional-support/">Emotional support</Link>
              <Link href="/privacy/">Privacy Policy</Link>
              <Link href="/terms/">Terms &amp; Conditions</Link>
              <Link href="/disclaimer/">Disclaimer</Link>
              <Link href="/content-guidelines/">Content Guidelines</Link>
              <Link href="/notice-takedown/">Notice and Take Down</Link>
            </nav>
            <p className="disclaimer">We help you find the right official channels to report scams and corruption.</p>
            <p className="copy">&copy; {new Date().getFullYear()} Scam Avenger. Links go to official government and trusted sites.</p>
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
