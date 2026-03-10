import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Scam Avenger privacy policy: how we collect, use, and protect your information when you use our scam reporting guides and services.',
  alternates: { canonical: `${siteUrl}/privacy/` },
};

export default function PrivacyPage() {
  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Privacy Policy</span>
      </nav>
      <h1 className="report-scam-title">Privacy Policy</h1>
      <p className="report-scam-lead">
        Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. We respect your privacy and are transparent about how we handle your data.
      </p>

      <section className="legal-content">
        <h2>Who we are</h2>
        <p>
          Scam Avenger (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates this website to help people find official channels to report scams and fraud. We provide guides, links to official agencies, and a community-based scam report service.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li><strong>Scam reports:</strong> When you submit a scam report through our site, we store the information you provide (e.g. narrative, report type, country). Reports can be submitted anonymously; we do not require an account or email unless you choose to provide a view token for later access.</li>
          <li><strong>Contact form:</strong> If you use our contact form, we collect your name, email, and message to respond to you.</li>
          <li><strong>Usage data:</strong> We may collect anonymised or aggregated data such as pages visited, referral sources, and general location (e.g. country) to improve the site. We may use cookies or similar technologies as described in this policy.</li>
        </ul>

        <h2>How we use your information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Display and moderate community scam reports (after review) to help others avoid similar scams.</li>
          <li>Respond to your contact requests and feedback.</li>
          <li>Improve our guides, site performance, and user experience.</li>
          <li>Comply with applicable law and protect our rights and the safety of our users.</li>
        </ul>

        <h2>Sharing and disclosure</h2>
        <p>We do not sell your personal information. We may share data only:</p>
        <ul>
          <li>With service providers who assist in operating the site (e.g. hosting, analytics) under strict confidentiality.</li>
          <li>When required by law or to protect rights, safety, or property.</li>
          <li>With your consent where applicable.</li>
        </ul>

        <h2>Data retention and security</h2>
        <p>We retain report data and contact messages as long as needed for the purposes described above and to comply with legal obligations. We implement reasonable technical and organisational measures to protect your data against unauthorised access, loss, or misuse.</p>

        <h2>Your rights</h2>
        <p>Depending on your location, you may have the right to access, correct, or delete your personal data, or to object to or restrict certain processing. To exercise these rights or ask questions about your data, contact us via our <Link href="/contact/">Contact</Link> page.</p>

        <h2>Changes to this policy</h2>
        <p>We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top will reflect the latest version. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
      </section>

      <p><Link href="/">← Back to Home</Link></p>
    </>
  );
}
