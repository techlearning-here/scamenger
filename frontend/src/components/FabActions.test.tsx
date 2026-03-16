import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FabActions } from '@/components/FabActions';
import { getConfig } from '@/data/config/api';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('@/data/config/api', () => ({
  getConfig: vi.fn(),
}));

describe('FabActions', () => {
  beforeEach(() => {
    vi.mocked(getConfig).mockReset();
  });

  it('renders Need help now? link always', () => {
    vi.mocked(getConfig).mockResolvedValue({ show_facebook_consent: true, show_report_scam: true });
    render(<FabActions />);
    const helpLink = screen.getByRole('link', { name: /Need help now\?/i });
    expect(helpLink).toBeInTheDocument();
    expect(helpLink).toHaveAttribute('href', '/help-now/');
  });

  it('renders report link in DOM with correct href', () => {
    vi.mocked(getConfig).mockResolvedValue({ show_facebook_consent: true, show_report_scam: true });
    render(<FabActions />);
    const reportLink = screen.getByRole('link', { name: /Report a scam/i, hidden: true });
    expect(reportLink).toBeInTheDocument();
    expect(reportLink).toHaveAttribute('href', '/report/');
  });

  it('shows report link after config resolves with show_report_scam true', async () => {
    vi.mocked(getConfig).mockResolvedValue({ show_facebook_consent: true, show_report_scam: true });
    render(<FabActions />);
    await waitFor(() => {
      const reportLink = screen.getByRole('link', { name: /Report a scam/i });
      const wrapper = reportLink.closest('[aria-hidden]');
      expect(wrapper).toHaveAttribute('aria-hidden', 'false');
    });
    const reportLink = screen.getByRole('link', { name: /Report a scam/i });
    expect(reportLink).toHaveAttribute('tabindex', '0');
  });

  it('keeps report link hidden when config resolves with show_report_scam false', async () => {
    vi.mocked(getConfig).mockResolvedValue({ show_facebook_consent: true, show_report_scam: false });
    render(<FabActions />);
    await waitFor(() => {
      expect(getConfig).toHaveBeenCalled();
    });
    const reportLink = screen.getByRole('link', { name: /Report a scam/i, hidden: true });
    const wrapper = reportLink.closest('[aria-hidden]');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(reportLink).toHaveAttribute('tabindex', '-1');
  });

  it('has fab_group container with quick actions label', () => {
    vi.mocked(getConfig).mockResolvedValue({ show_facebook_consent: true, show_report_scam: false });
    render(<FabActions />);
    const group = screen.getByRole('group', { name: /Quick actions/i });
    expect(group).toHaveClass('fab_group');
  });
});
