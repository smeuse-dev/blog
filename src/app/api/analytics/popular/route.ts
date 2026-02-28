import { NextResponse } from 'next/server';
import { getPopularPosts } from '@/lib/analytics';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
  try {
    const popular = await getPopularPosts(10, 30);
    const allPosts = getAllPosts();
    const titleMap = new Map(allPosts.map(p => [p.slug, p.title]));

    const enriched = popular.map((p: { slug: string; views: number; unique_visitors: number }) => ({
      ...p,
      title: titleMap.get(p.slug) || p.slug.replace(/-/g, ' '),
    }));

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json([]);
  }
}
