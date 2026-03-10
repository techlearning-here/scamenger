import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { NavReportScamLink } from '@/components/NavReportScamLink';
import { getConfig } from '@/data/config/api';

vi.mock('@/data/config/api', () => ({
  getConfig: vi.fn(),
}));

describe('NavReportScamLink', () => {
  beforeEach(() => {
    vi.mocked(getConfig).mockReset();
  });

  it('renders nothing when show_report_scam is false', async () => {
    vi.mocked(getConfig).mockResolvedValue({ show_facebook_consent: true, show_report_scam: false });
    render(<NavReportScamLink />);
    await waitFor(() => {
      expect(getConfig).toHaveBeenCalled();
    });
    expect(screen.queryByRole('link', { name: /Report a scam/ })).not.toBeInTheDocument();
  });

  it('renders Report a scam link when show_report_scam is true', async () => {
    vi.mocked(getConfig).mockResolvedValue({ show_facebook_consent: true, show_report_scam: true });
    render(<NavReportScamLink />);
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Report a scam' })).toBeInTheDocument();
    });
    const link = screen.getByRole('link', { name: 'Report a scam' });
    expect(link).toHaveAttribute('href', '/report');
    expect(link).toHaveClass('site_nav_report');
  });
});
