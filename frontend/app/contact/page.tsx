import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from './ContactForm';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Contact us',
  description: 'Contact Scam Avenger with questions or feedback. We’re building a community-based scam database to support people who have been targeted.',
  keywords: 'contact Scam Avenger, scam report feedback, fraud report support',
  alternates: { canonical: `${siteUrl}/contact/` },
  openGraph: {
    title: 'Contact us | Scam Avenger',
    description: 'Contact Scam Avenger with questions or feedback.',
    url: `${siteUrl}/contact/`,
  },
  twitter: {
    card: 'summary',
    title: 'Contact us | Scam Avenger',
    description: 'Contact Scam Avenger with questions or feedback.',
  },
};

export default function ContactPage() {
  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <Link href="/about/">About</Link>
        <span className="back-sep"> / </span>
        <span>Contact</span>
      </nav>
      <h1 id="contact-heading" className="report-scam-title">Contact us</h1>
      <p className="report-scam-lead">
        Have a question, suggestion, or want to get in touch? Use the form below or email us directly.
      </p>
      <ContactForm />
      <p className="contact-report-note">
        <strong>To report a scam:</strong> Use our <Link href="/report/">Report a scam</Link> form. We don’t forward reports by email—submitting there gives you a shareable link and adds to our community database.
      </p>
    </>
  );
}
