import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Content Guidelines',
  description: 'Content guidelines for Scam Avenger. Rules for submitting scam reports and using our community features.',
  alternates: { canonical: `${siteUrl}/content-guidelines/` },
};

export default function ContentGuidelinesPage() {
  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Content Guidelines</span>
      </nav>
      <h1 className="report-scam-title">Content Guidelines</h1>
      <p className="report-scam-lead">
        These guidelines apply to scam reports and any other content you submit to Scam Avenger. By submitting content, you agree to follow these rules.
      </p>

      <section className="legal-content">
        <h2>Purpose of community reports</h2>
        <p>Our scam report feature lets you share your experience to help others recognise and avoid similar scams. Published reports are moderated to keep the community safe and useful.</p>

        <h2>What we allow</h2>
        <ul>
          <li><strong>Accurate, first-hand experiences:</strong> Describe what happened to you or someone you are authorised to report for. Stick to facts you can reasonably support.</li>
          <li><strong>Relevant detail:</strong> Include information that helps others (e.g. type of scam, how you were contacted, what was lost or at risk) without sharing unnecessary personal data.</li>
          <li><strong>Respectful language:</strong> Use clear, factual language. Avoid slurs, hate speech, or personal attacks.</li>
        </ul>

        <h2>What we do not allow</h2>
        <ul>
          <li><strong>False or misleading information:</strong> Do not invent scams, exaggerate, or deliberately mislead. Reports may be rejected or removed if we find they are not genuine.</li>
          <li><strong>Personal data of others:</strong> Do not include names, addresses, phone numbers, or other identifying details of individuals (except where clearly public and relevant, e.g. a known scammer alias already in the public domain). We will remove content that exposes private individuals.</li>
          <li><strong>Harassment or abuse:</strong> Do not use reports to target, harass, or defame individuals or groups.</li>
          <li><strong>Spam or promotion:</strong> Do not advertise products or services or use the report form for unrelated commercial purposes.</li>
          <li><strong>Illegal content:</strong> Do not submit content that incites violence, exploits minors, or violates applicable law.</li>
        </ul>

        <h2>Moderation</h2>
        <p>We review reports before publication. We may reject, edit, or remove content that violates these guidelines or our <Link href="/terms/">Terms &amp; Conditions</Link>. We are not obliged to publish every submission and may suspend or restrict access for repeated violations.</p>

        <h2>Reporting violations</h2>
        <p>If you see content that breaks these guidelines, use our <Link href="/notice-takedown/">Notice and Take Down</Link> process or <Link href="/contact/">Contact</Link> us.</p>
      </section>

      <p><Link href="/">← Back to Home</Link></p>
    </>
  );
}
