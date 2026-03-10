import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer for Scam Avenger. We provide guides and links for informational purposes only; we are not responsible for external sites or outcomes.',
  alternates: { canonical: `${siteUrl}/disclaimer/` },
};

export default function DisclaimerPage() {
  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Disclaimer</span>
      </nav>
      <h1 className="report-scam-title">Disclaimer</h1>
      <p className="report-scam-lead">
        Important information about the limits of our service and your use of this site.
      </p>

      <section className="legal-content">
        <h2>Informational purpose only</h2>
        <p>
          Scam Avenger is an informational resource. We aim to help you find official channels to report scams and fraud. Our guides, links, and community reports are provided for general information only and do not constitute legal, financial, or professional advice.
        </p>

        <h2>No guarantee of accuracy</h2>
        <p>While we strive to keep information up to date and accurate:</p>
        <ul>
          <li>Official reporting links, agency names, and procedures may change. Always verify on the official website before submitting a report.</li>
          <li>Community-submitted reports reflect the experience of submitters; we do not independently verify every claim.</li>
          <li>We do not guarantee outcomes from reporting to any agency or that your report will be acted upon.</li>
        </ul>

        <h2>External links</h2>
        <p>This site links to third-party websites (e.g. government agencies, consumer protection bodies). We do not control and are not responsible for the content, privacy practices, or availability of those sites. Linking does not imply endorsement.</p>

        <h2>No liability</h2>
        <p>To the fullest extent permitted by law, Scam Avenger and its operators shall not be liable for any loss or damage arising from your use of this site or reliance on its content, including reliance on external links or community reports.</p>

        <h2>Reporting and outcomes</h2>
        <p>We do not forward reports on your behalf. When you use an official link from our site, you interact directly with that organisation. Any outcome (e.g. investigation, refund) is between you and that organisation.</p>
      </section>

      <p><Link href="/">← Back to Home</Link></p>
    </>
  );
}
