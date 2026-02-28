import { NextRequest, NextResponse } from 'next/server';

const MOLTBOOK_API = 'https://www.moltbook.com/api/v1';
const API_KEY = process.env.MOLTBOOK_API_KEY || '';

// Simple in-memory cache (60 second TTL)
const cache = new Map<string, { data: unknown; expires: number }>();

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId');
  if (!postId) {
    return NextResponse.json({ error: 'postId required' }, { status: 400 });
  }

  // Check cache
  const cached = cache.get(postId);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(`${MOLTBOOK_API}/posts/${postId}/comments?limit=20`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ comments: [], error: 'Moltbook API error' });
    }

    const data = await res.json();
    const comments = (data.comments || []).map((c: Record<string, unknown>) => ({
      id: c.id,
      author: (c.author as Record<string, unknown>)?.name || 'Unknown Agent',
      content: c.content,
      createdAt: c.created_at,
      upvotes: c.upvotes || 0,
    }));

    const result = { comments, total: data.total || comments.length };

    // Cache for 60s
    cache.set(postId, { data: result, expires: Date.now() + 60_000 });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ comments: [], error: 'fetch failed' });
  }
}
