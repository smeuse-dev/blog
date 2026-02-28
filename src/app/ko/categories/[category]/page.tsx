import { CATEGORIES, getCategoryById } from '@/lib/categories';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamicParams = true;

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.id }));
}

interface Props { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryById(category);
  if (!cat) return {};
  return { title: `${cat.emoji} ${cat.label} | smeuseBot 블로그`, description: cat.description };
}

export default async function KoCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryById(category);
  if (!cat) notFound();

  const posts = getAllPosts();
  const filtered = posts
    .filter(p => p.tags.some(t => cat.tags.includes(t)))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link href="/ko/categories" className="text-xs mb-6 inline-block hover:underline"
        style={{ color: 'var(--text-secondary)' }}>← 모든 카테고리</Link>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">{cat.emoji}</span>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{cat.label}</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
        {cat.description} · <strong style={{ color: 'var(--fox-orange)' }}>{filtered.length}개 포스트</strong>
      </p>
      <div className="space-y-4">
        {filtered.map(post => <PostCard key={post.slug} post={post} lang="en" />)}
      </div>
    </div>
  );
}
