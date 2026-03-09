'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitContactMessage } from '@/data/contact/api';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) {
      setError('Name and email are required');
      return;
    }
    setSubmitting(true);
    try {
      await submitContactMessage({ name: trimmedName, email: trimmedEmail, message });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="contact-success" role="status">
        <p>Thanks for your message. We’ll get back to you as soon as we can.</p>
        <p><button type="button" onClick={() => { setSubmitted(false); setError(null); }} className="contact-back-btn">Send another message</button></p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="report-scam-form contact-form" aria-labelledby="contact-heading">
      <p className="contact-intro">Have a question or feedback? Send us a message and we’ll get back to you.</p>
      {error && (
        <div className="report-scam-error" role="alert">{error}</div>
      )}
      <div className="form-group">
        <label htmlFor="contact-name">Name <span className="required">*</span></label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          placeholder="Your name"
          autoComplete="name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="contact-email">Email <span className="required">*</span></label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          placeholder="your@email.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="contact-message">Message <span className="required">*</span></label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="form-control form-control-textarea"
          placeholder="Your message or question..."
          rows={5}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={submitting} className="report-scam-submit">{submitting ? 'Sending…' : 'Send message'}</button>
        <Link href="/" className="report-scam-cancel">Cancel</Link>
      </div>
    </form>
  );
}
