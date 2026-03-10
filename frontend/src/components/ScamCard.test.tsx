import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScamCard } from '@/components/ScamCard';

describe('ScamCard', () => {
  it('renders name and link with default href', () => {
    render(
      <ScamCard slug="phishing" name="Phishing" category="online" />,
    );
    expect(screen.getByText('Phishing')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Guide: Phishing/ });
    expect(link).toHaveAttribute('href', '/us/scams/phishing');
  });

  it('uses custom href when provided', () => {
    render(
      <ScamCard
        slug="phishing"
        name="Phishing"
        category="online"
        href="/custom/phishing/"
      />,
    );
    const link = screen.getByRole('link', { name: /Guide: Phishing/ });
    expect(link).toHaveAttribute('href', '/custom/phishing');
  });

  it('renders most-reported badge for known slug', () => {
    render(
      <ScamCard slug="phishing" name="Phishing" category="online" />,
    );
    expect(screen.getByText('Most reported')).toBeInTheDocument();
  });

  it('renders without prevalence badge when slug has none', () => {
    render(
      <ScamCard slug="unknown-slug-xyz" name="Other" category="other" />,
    );
    expect(screen.queryByText('Most reported')).not.toBeInTheDocument();
    expect(screen.queryByText('Trending')).not.toBeInTheDocument();
  });
});
