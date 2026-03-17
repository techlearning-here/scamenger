import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.PUBLIC_SITE_URL ||
  'https://scamenger.com';
const CANONICAL_HOST = new URL(CANONICAL_ORIGIN).hostname;

/**
 * Redirects non-canonical hosts (www, http) to the canonical origin (https, non-www)
 * so Search Console and crawlers see a single canonical URL.
 */
export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const proto = request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '');

  const isProductionHost =
    hostname === CANONICAL_HOST || hostname === `www.${CANONICAL_HOST}`;
  if (!isProductionHost) {
    return NextResponse.next();
  }

  const canonicalUrl = `${CANONICAL_ORIGIN}${pathname}${search}`;

  if (hostname === `www.${CANONICAL_HOST}`) {
    return NextResponse.redirect(canonicalUrl, 308);
  }

  if (proto === 'http') {
    return NextResponse.redirect(canonicalUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all pathnames except _next/static, _next/image, favicon, etc.
     */
    '/((?!_next/static|_next/image|icon|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
