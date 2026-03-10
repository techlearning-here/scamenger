import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getConfig, invalidateConfigCache } from '@/data/config/api';

describe('config api', () => {
  const fallback = { show_facebook_consent: true, show_report_scam: true };

  beforeEach(() => {
    vi.restoreAllMocks();
    invalidateConfigCache();
  });

  it('getConfig returns fallback when response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false }),
    );
    const result = await getConfig();
    expect(result).toEqual(fallback);
  });

  it('getConfig returns parsed data when response is ok', async () => {
    const payload = { show_facebook_consent: false, show_report_scam: true };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => payload,
      }),
    );
    const result = await getConfig();
    expect(result).toEqual(payload);
  });

  it('invalidateConfigCache clears cache so next getConfig refetches', async () => {
    const payload = { show_facebook_consent: false, show_report_scam: false };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    });
    vi.stubGlobal('fetch', fetchMock);
    await getConfig();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await getConfig();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    invalidateConfigCache();
    await getConfig();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
