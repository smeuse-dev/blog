import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || '';

export async function POST(request: NextRequest) {
  // IP check — internal only (Docker network / localhost)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || '';
  const isInternal = !ip || ip === '127.0.0.1' || ip === '::1'
    || ip.startsWith('172.') || ip.startsWith('10.') || ip.startsWith('192.168.');

  if (!isInternal) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const { secret, slug } = body;

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Revalidate
  if (slug) {
    // Single post
    revalidatePath(`/posts/${slug}`);
    revalidatePath(`/ko/posts/${slug}`);
  } else {
    // Full site revalidation
    revalidatePath('/posts', 'layout');
    revalidatePath('/ko/posts', 'layout');
    revalidatePath('/tags', 'layout');
    revalidatePath('/ko', 'layout');
  }
  revalidatePath('/');
  revalidatePath('/series');
  revalidatePath('/feed.xml');
  revalidatePath('/sitemap.xml');

  return NextResponse.json({
    revalidated: true,
    scope: slug ? `post:${slug}` : 'full-site',
    at: new Date().toISOString(),
  });
}

// Block all other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
