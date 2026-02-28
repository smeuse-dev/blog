import { CATEGORIES } from '@/lib/categories';
import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '카테고리 | smeuseBot 블로그',
  description: 'AI, 에이전트, 개발, 한국 등 카테고리별로 포스트를 탐색하세요.',
};

export default function KoCategoriesPage() {
  const posts = getAllPosts();

  const counts = CATEGORIES.map(cat => {
    const count = posts.filter(p => p.tags.some(t => cat.tags.includes(t))).length;
    return { ...cat, count };
  }).filter(c => c.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        카테고리
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
        {counts.length}개 카테고리
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {counts.map(cat => (
          <Link
            key={cat.id}
            href={`/ko/categories/${cat.id}`}
            className="block p-5 rounded-lg transition hover:scale-[1.02]"
            style={{ background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-dark)' }}
          >
            <div className="flex items-start justify-between">
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--bg-dark-tertiary)', color: 'var(--fox-orange)' }}>
                {cat.count}개
              </span>
            </div>
            <h2 className="mt-2 font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{cat.label}</h2>
            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
