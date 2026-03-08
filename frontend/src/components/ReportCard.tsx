interface ReportCardProps {
  who: string;
  when: string;
  prepare?: string[];
  href: string;
  label: string;
}

export function ReportCard({ who, when, prepare = [], href, label }: ReportCardProps) {
  return (
    <article className="report-card">
      <p className="report-who"><strong>Who:</strong> {who}</p>
      <p className="report-when"><strong>When to use:</strong> {when}</p>
      {prepare.length > 0 && (
        <div className="report-prepare">
          <p><strong>What to prepare:</strong></p>
          <ul>
            {prepare.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      <a href={href} className="report-link" target="_blank" rel="noopener noreferrer">{label}</a>
    </article>
  );
}
