import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { LookupReportForm } from './LookupReportForm';
import { getReportById } from '@/data/reports/api';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));
vi.mock('@/data/reports/api', () => ({
  getReportById: vi.fn(),
}));

describe('LookupReportForm', () => {
  beforeEach(() => {
    vi.mocked(getReportById).mockReset();
    mockPush.mockClear();
  });

  it('shows error when submitting empty report ID', async () => {
    render(<LookupReportForm />);
    const form = screen.getByRole('button', { name: /View report/ }).closest('form');
    if (!form) throw new Error('form not found');
    await act(async () => {
      form.requestSubmit();
    });
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Please enter a report ID.');
    });
    expect(getReportById).not.toHaveBeenCalled();
  });

  it('shows error when report not found (404)', async () => {
    vi.mocked(getReportById).mockResolvedValue(null);
    render(<LookupReportForm />);
    const input = screen.getByRole('textbox', { name: /Report ID/ });
    input.setAttribute('value', 'ecfb0b4a-3398-433a-8a36-d1d519d6f4f7');
    (input as HTMLInputElement).value = 'ecfb0b4a-3398-433a-8a36-d1d519d6f4f7';
    const form = screen.getByRole('button', { name: /View report/ }).closest('form');
    if (!form) throw new Error('form not found');
    await act(async () => {
      form.requestSubmit();
    });
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('No report found');
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('navigates to report page when report is found', async () => {
    const reportId = 'ecfb0b4a-3398-433a-8a36-d1d519d6f4f7';
    vi.mocked(getReportById).mockResolvedValue({
      id: reportId,
      slug: 'abc',
      country_origin: 'US',
      report_type: 'website',
      category: null,
      report_type_detail: null,
      lost_money: false,
      lost_money_range: null,
      narrative: 'Test',
      consent_share_authorities: false,
      consent_share_social: false,
      created_at: '2025-01-15T12:00:00Z',
    });
    render(<LookupReportForm />);
    const input = screen.getByRole('textbox', { name: /Report ID/ }) as HTMLInputElement;
    input.focus();
    input.value = reportId;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const form = screen.getByRole('button', { name: /View report/ }).closest('form');
    if (!form) throw new Error('form not found');
    await act(async () => {
      form.requestSubmit();
    });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`/reports/?id=${reportId}`);
    });
  });

  it('includes view_token in URL when report has submitter_view_token', async () => {
    const reportId = 'ecfb0b4a-3398-433a-8a36-d1d519d6f4f7';
    const viewToken = 'secret-token';
    vi.mocked(getReportById).mockResolvedValue({
      id: reportId,
      slug: 'abc',
      country_origin: 'US',
      report_type: 'website',
      category: null,
      report_type_detail: null,
      lost_money: false,
      lost_money_range: null,
      narrative: 'Test',
      consent_share_authorities: false,
      consent_share_social: false,
      created_at: '2025-01-15T12:00:00Z',
      submitter_view_token: viewToken,
    });
    render(<LookupReportForm />);
    const input = screen.getByRole('textbox', { name: /Report ID/ }) as HTMLInputElement;
    input.focus();
    input.value = reportId;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const form = screen.getByRole('button', { name: /View report/ }).closest('form');
    if (!form) throw new Error('form not found');
    await act(async () => {
      form.requestSubmit();
    });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`/reports/?id=${reportId}&view_token=${viewToken}`);
    });
  });
});
