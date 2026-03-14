/**
 * GET /api/reports/recent
 * Returns a summary of recent approved community reports for use in the newsletter (digest).
 * Only approved reports; narrative truncated for privacy-safe summary.
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

const DEFAULT_LIMIT = 15;
const MAX_LIMIT = 30;
const NARRATIVE_TRUNCATE = 120;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT),
  );

  if (!supabaseServer) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const { data: rows, error } = await supabaseServer
    .from('reports')
    .select('id, slug, report_type, category, country_origin, created_at, narrative')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ message: 'Failed to load recent reports.' }, { status: 500 });
  }

  const items = (rows ?? []).map((row) => {
    const narrative = row.narrative && typeof row.narrative === 'string'
      ? (row.narrative.length <= NARRATIVE_TRUNCATE
          ? row.narrative
          : `${row.narrative.slice(0, NARRATIVE_TRUNCATE).trim()}…`)
      : null;
    return {
      id: row.id,
      slug: row.slug,
      report_type: row.report_type,
      category: row.category ?? null,
      country_origin: row.country_origin,
      created_at: row.created_at,
      narrative,
    };
  });

  return NextResponse.json({
    items,
    total: items.length,
  });
}
