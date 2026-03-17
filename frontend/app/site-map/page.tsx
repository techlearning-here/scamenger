import type { Metadata } from 'next';
import Link from 'next/link';
import { getUsScamSlugs, getUsScamTypes } from '@/data/us-scams';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

/** Main site sections for the HTML sitemap. Order matches importance for users and crawlers. */
const MAIN_SECTIONS: { path: string; label: string }[] = [
  { path: '/', label: 'Home' },
  { path: '/report/', label: 'Report a scam' },
  { path: '/lookup-report/', label: 'Look up report' },
  { path: '/help-now/', label: 'Need help now?' },
  { path: '/immediate-help/', label: 'Immediate response (0–24 hours)' },
  { path: '/emotional-support/', label: 'Emotional support' },
  { path: '/spot-and-avoid-scams/', label: 'Spot and avoid scams' },
  { path: '/stories/', label: 'Scam stories' },
  { path: '/tools/', label: 'Tools & protect guides' },
  { path: '/tools/protect-phone/', label: 'Protect your phone' },
  { path: '/tools/protect-laptop/', label: 'Protect your laptop' },
  { path: '/tools/protect-bank-account/', label: 'Protect bank account' },
  { path: '/tools/protect-credit-card/', label: 'Protect credit card' },
  { path: '/tools/books/', label: 'Books on scams & fraud' },
  { path: '/news/', label: 'News' },
  { path: '/reports/', label: 'Reports' },
  { path: '/newsletter/', label: 'Newsletter' },
  { path: '/about/', label: 'About' },
  { path: '/contact/', label: 'Contact' },
  { path: '/us/online-phone-scams/', label: 'US: Online & phone scams' },
  { path: '/us/financial-banking/', label: 'US: Financial & banking' },
  { path: '/us/government-impersonation-tax/', label: 'US: Government impersonation & tax' },
  { path: '/us/corruption-fraud-waste/', label: 'US: Corruption, fraud & waste' },
  { path: '/privacy/', label: 'Privacy Policy' },
  { path: '/terms/', label: 'Terms & Conditions' },
  { path: '/disclaimer/', label: 'Disclaimer' },
  { path: '/content-guidelines/', label: 'Content Guidelines' },
  { path: '/notice-takedown/', label: 'Notice and Take Down' },
];

export const metadata: Metadata = {
  title: 'Sitemap – Scam Avenger',
  description: 'Full list of pages: report a scam, get help, read guides, and find official resources by scam type.',
  alternates: { canonical: `${siteUrl}/site-map/` },
};

export default function SiteMapPage() {
  const scamTypes = getUsScamTypes();
  const scamSlugs = getUsScamSlugs();
  const scamBySlug = new Map(scamTypes.map((s) => [s.slug, s]));

  return (
    <main className="layout_container sitemap-page-main">
      <h1>Sitemap</h1>
      <p className="sitemap-intro">
        All main pages and scam guides. Use this to find what you need or to see the full site structure.
      </p>

      <section aria-labelledby="sitemap-main-heading">
        <h2 id="sitemap-main-heading">Main pages</h2>
        <ul className="sitemap-list">
          {MAIN_SECTIONS.map(({ path, label }) => (
            <li key={path}>
              <Link href={path}>{label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sitemap-scams-heading">
        <h2 id="sitemap-scams-heading">US scam &amp; fraud guides</h2>
        <ul className="sitemap-list">
          {scamSlugs.map((slug) => {
            const scam = scamBySlug.get(slug);
            const label = scam?.name ?? slug;
            return (
              <li key={slug}>
                <Link href={`/us/scams/${slug}/`}>{label}</Link>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="sitemap-xml">
        For crawlers: <a href="/sitemap.xml">XML sitemap</a>.
      </p>
    </main>
  );
}
