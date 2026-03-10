import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Notice and Take Down',
  description: 'How to report illegal or infringing content on Scam Avenger. Notice and take down process for copyright, defamation, and policy violations.',
  alternates: { canonical: `${siteUrl}/notice-takedown/` },
};

export default function NoticeTakedownPage() {
  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Notice and Take Down</span>
      </nav>
      <h1 className="report-scam-title">Notice and Take Down</h1>
      <p className="report-scam-lead">
        If you believe content on Scam Avenger is illegal, infringing, or violates our policies, you can request its removal using the process below.
      </p>

      <section className="legal-content">
        <h2>What you can report</h2>
        <p>We will consider take-down requests for content that:</p>
        <ul>
          <li>Infringes your copyright or other intellectual property rights.</li>
          <li>Is defamatory or unlawfully harms your reputation.</li>
          <li>Contains your personal data without consent (e.g. doxxing).</li>
          <li>Violates our <Link href="/content-guidelines/">Content Guidelines</Link> or <Link href="/terms/">Terms &amp; Conditions</Link> (e.g. false reports, harassment, spam).</li>
          <li>Is otherwise unlawful under applicable law.</li>
        </ul>

        <h2>How to submit a notice</h2>
        <p>Send a notice to us via our <Link href="/contact/">Contact</Link> page. Your notice should include:</p>
        <ul>
          <li><strong>Your identity:</strong> Full name and a way for us to contact you (email or postal address).</li>
          <li><strong>Identification of the content:</strong> Clear description or URL of the specific content you want removed.</li>
          <li><strong>Reason:</strong> Explain why the content is illegal, infringing, or in breach of our policies (e.g. copyright: describe the work and your rights; defamation: explain the false statement; personal data: confirm it is your data and that you did not consent).</li>
          <li><strong>Good faith:</strong> A statement that the information in your notice is accurate and that you are the rights holder or authorised to act on their behalf.</li>
        </ul>

        <h2>What we do</h2>
        <p>We will review valid notices promptly. We may remove or disable access to content that we determine violates the law or our policies. We are not obliged to remove content that we reasonably believe is lawful or protected (e.g. fair use, legitimate reporting).</p>

        <h2>Abuse</h2>
        <p>Filing false or malicious take-down notices may result in legal liability. We may share notice details with the affected user or authorities where required by law.</p>
      </section>

      <p><Link href="/">← Back to Home</Link></p>
    </>
  );
}
