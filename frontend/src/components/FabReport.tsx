import Link from 'next/link';

/**
 * Floating action button linking to the report-a-scam form.
 * Rendered on every page for quick access.
 */
export function FabReport() {
  return (
    <Link
      href="/report/"
      className="fab_report"
      aria-label="Report a scam"
      title="Report a scam"
    >
      <span className="fab_report_text">Report a scam</span>
    </Link>
  );
}
