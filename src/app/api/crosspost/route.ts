import { NextRequest, NextResponse } from 'next/server';
import { runCrosspost, getCrosspostStatus } from '@/lib/crosspost';

// GET /api/crosspost — check status
export async function GET() {
  const status = getCrosspostStatus();
  return NextResponse.json(status);
}

// POST /api/crosspost — trigger manual crosspost
export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret') || '';
  const expectedSecret = process.env.ADMIN_SECRET || process.env.REVALIDATE_SECRET || '';

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runCrosspost();
  return NextResponse.json(result);
}
