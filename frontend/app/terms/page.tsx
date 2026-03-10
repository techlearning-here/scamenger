import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions of use for Scam Avenger. Rules for using our scam reporting guides, community reports, and services.',
  alternates: { canonical: `${siteUrl}/terms/` },
};

export default function TermsPage() {
  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Terms &amp; Conditions</span>
      </nav>
      <h1 className="report-scam-title">Terms &amp; Conditions</h1>
      <p className="report-scam-lead">
        Please read these terms before using Scam Avenger. By using this site, you agree to be bound by these terms.
      </p>

      <section className="legal-content">
        <h2>Acceptance of terms</h2>
        <p>
          By accessing or using Scam Avenger (&quot;the Site&quot;), you agree to these Terms &amp; Conditions and our <Link href="/privacy/">Privacy Policy</Link>. If you do not agree, do not use the Site.
        </p>

        <h2>Use of the service</h2>
        <p>The Site provides:</p>
        <ul>
          <li>Guides and links to official reporting channels (e.g. government agencies, consumer protection bodies) for reporting scams and fraud.</li>
          <li>A community-based scam report feature where you can submit reports that, after moderation, may be published to help others.</li>
          <li>News and information related to scams and consumer protection.</li>
        </ul>
        <p>You may use the Site only for lawful purposes and in accordance with these terms. You must not use the Site to harass others, submit false or misleading reports, infringe intellectual property, or violate any applicable law.</p>

        <h2>Scam reports and user content</h2>
        <p>When you submit a scam report or other content:</p>
        <ul>
          <li>You confirm that the information you provide is accurate to the best of your knowledge and that you have the right to share it.</li>
          <li>You grant us a non-exclusive, royalty-free licence to use, display, and moderate your content in connection with the Site.</li>
          <li>We may reject, edit, or remove content that violates our <Link href="/content-guidelines/">Content Guidelines</Link> or these terms.</li>
        </ul>

        <h2>No professional advice</h2>
        <p>The Site is for informational purposes only. We do not provide legal, financial, or professional advice. Always rely on official sources and qualified professionals for decisions about reporting or resolving scams.</p>

        <h2>Disclaimer of warranties</h2>
        <p>The Site and all content are provided &quot;as is&quot; without warranties of any kind. We do not guarantee accuracy, completeness, or suitability of any guide or link. See our <Link href="/disclaimer/">Disclaimer</Link> for more information.</p>

        <h2>Limitation of liability</h2>
        <p>To the fullest extent permitted by law, Scam Avenger and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or reliance on its content.</p>

        <h2>Links to third-party sites</h2>
        <p>The Site links to external websites (e.g. government and consumer protection sites). We are not responsible for the content, privacy practices, or availability of those sites.</p>

        <h2>Changes to terms</h2>
        <p>We may update these terms from time to time. Continued use of the Site after changes constitutes acceptance. Material changes may be highlighted on the Site or via contact.</p>

        <h2>Contact</h2>
        <p>For questions about these terms, please use our <Link href="/contact/">Contact</Link> page.</p>
      </section>

      <p><Link href="/">← Back to Home</Link></p>
    </>
  );
}
