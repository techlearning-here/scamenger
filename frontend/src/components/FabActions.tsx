import Link from 'next/link';

/**
 * Floating action buttons: "Need help now?" (emergency contacts) and "Report a scam".
 * Rendered on every page for quick access.
 */
export function FabActions() {
  return (
    <div className="fab_group" aria-label="Quick actions">
      <Link
        href="/help-now/"
        className="fab_help_now"
        aria-label="Need help now? Emergency contacts and reporting links"
        title="Need help now?"
      >
        <span className="fab_help_now_text">Need help now?</span>
      </Link>
      <Link
        href="/report/"
        className="fab_report"
        aria-label="Report a scam"
        title="Report a scam"
      >
        <span className="fab_report_text">Report a scam</span>
      </Link>
    </div>
  );
}
