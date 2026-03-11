import Link from 'next/link';

export interface ProgressStepsProps {
  /** Link for the Prevent step. Default: #spot-heading (same-page anchor on scam guide). */
  preventHref?: string;
  /** Label for the Prevent step link. Default: "How to spot it". */
  preventLabel?: string;
}

/**
 * Progress indication: Report → Track → Prevent.
 * Shown after selecting a scam type (or category) so users know what happens next.
 */
export function ProgressSteps({
  preventHref = '#spot-heading',
  preventLabel = 'How to spot it',
}: ProgressStepsProps) {
  return (
    <nav className="progress-steps" aria-label="What happens next">
      <h2 id="progress-steps-heading" className="progress-steps-title">
        What happens next
      </h2>
      <ol className="progress-steps-list" aria-labelledby="progress-steps-heading">
        <li className="progress-step">
          <span className="progress-step-label">Report</span>
          <span className="progress-step-desc">
            Submit your experience so others can avoid the same scam.
          </span>
          <Link href="/report/" className="progress-step-link">
            Report a scam
          </Link>
        </li>
        <li className="progress-step">
          <span className="progress-step-label">Track</span>
          <span className="progress-step-desc">
            View your report or browse community reports.
          </span>
          <Link href="/reports/" className="progress-step-link">
            View reports
          </Link>
        </li>
        <li className="progress-step">
          <span className="progress-step-label">Prevent</span>
          <span className="progress-step-desc">
            Learn how to spot this scam and protect yourself.
          </span>
          <a href={preventHref} className="progress-step-link">
            {preventLabel}
          </a>
        </li>
      </ol>
    </nav>
  );
}
