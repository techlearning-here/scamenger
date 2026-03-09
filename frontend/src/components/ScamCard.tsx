import Link from 'next/link';
import { getScamIcon } from '@/data/scams/icons';
import type { ScamCategoryId } from '@/data/scams/types';

export interface ScamCardProps {
  slug: string;
  name: string;
  category: ScamCategoryId;
  href?: string;
}

/**
 * Card with icon and name for a scam type. Used in "Popular guides", "Scam types in this category", and related lists.
 */
export function ScamCard({ slug, name, category, href }: ScamCardProps) {
  const url = href ?? `/us/scams/${slug}/`;
  const icon = getScamIcon(slug, category);

  return (
    <li className="scam-card-wrap">
      <Link href={url} className="scam-card" aria-label={`Guide: ${name}`}>
        <span className="scam-card-icon-wrap" aria-hidden="true">
          <span className="scam-card-icon">{icon}</span>
        </span>
        <span className="scam-card-name">{name}</span>
      </Link>
    </li>
  );
}
