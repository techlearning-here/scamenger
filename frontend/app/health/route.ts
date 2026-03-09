import { NextResponse } from 'next/server';

/**
 * Health check for Render / load balancers.
 * GET /health returns 200 with { status: "ok" }.
 */
export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}

/** HEAD /health for load balancers that probe with HEAD. */
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
