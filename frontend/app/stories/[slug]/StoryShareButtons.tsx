'use client';

import { ReportShareButtons } from '@/components/ReportShareButtons';

export interface StoryShareButtonsProps {
  url: string;
  title: string;
}

/**
 * Share buttons for a story page: X, Threads, WhatsApp (and Facebook via ReportShareButtons).
 * Uses the same component as report pages with story URL and title.
 */
export function StoryShareButtons({ url, title }: StoryShareButtonsProps) {
  return (
    <ReportShareButtons
      url={url}
      shareText={`${title} – Scam Avenger`}
    />
  );
}
