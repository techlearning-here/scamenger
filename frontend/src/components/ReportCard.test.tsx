import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReportCard } from '@/components/ReportCard';

describe('ReportCard', () => {
  it('renders who, when, and link', () => {
    render(
      <ReportCard
        who="The FTC"
        when="Use for consumer scams."
        href="https://reportfraud.ftc.gov/"
        label="Go to FTC ReportFraud"
      />
    );
    expect(screen.getByText(/The FTC/)).toBeInTheDocument();
    expect(screen.getByText(/Use for consumer scams/)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Go to FTC ReportFraud/ });
    expect(link).toHaveAttribute('href', 'https://reportfraud.ftc.gov/');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders prepare list when provided', () => {
    render(
      <ReportCard
        who="Who"
        when="When"
        prepare={['Dates', 'Amounts']}
        href="https://example.com"
        label="Report"
      />
    );
    expect(screen.getByText(/What to prepare/)).toBeInTheDocument();
    expect(screen.getByText('Dates')).toBeInTheDocument();
    expect(screen.getByText('Amounts')).toBeInTheDocument();
  });

  it('does not render prepare section when prepare is empty', () => {
    render(
      <ReportCard
        who="Who"
        when="When"
        href="https://example.com"
        label="Report"
      />
    );
    expect(screen.queryByText(/What to prepare/)).not.toBeInTheDocument();
  });
});
