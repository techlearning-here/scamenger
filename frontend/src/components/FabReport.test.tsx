import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FabReport } from '@/components/FabReport';

describe('FabReport', () => {
  it('renders a link to /report/ with accessible label', () => {
    render(<FabReport />);
    const link = screen.getByRole('link', { name: /report a scam/i });
    expect(link.getAttribute('href')).toMatch(/\/report\/?$/);
    expect(link).toHaveAttribute('title', 'Report a scam');
  });

  it('has the FAB class for styling', () => {
    render(<FabReport />);
    const link = screen.getByRole('link', { name: /report a scam/i });
    expect(link).toHaveClass('fab_report');
  });

  it('displays the text "Report a scam"', () => {
    render(<FabReport />);
    expect(screen.getByText('Report a scam')).toBeInTheDocument();
  });
});
