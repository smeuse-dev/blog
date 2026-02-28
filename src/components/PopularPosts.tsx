'use client';

import { useState, useEffect } from 'react';

interface PopularPost {
  slug: string;
  title: string;
  views: number;
  unique_visitors: number;
}

export default function PopularPosts() {
  const [posts, setPosts] = useState<PopularPost[]>([]);

  useEffect(() => {
    fetch('/api/analytics/popular')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setPosts(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  const listContent = (
    <ul className="space-y-2">
      {posts.map((p, i) => (
        <li key={p.slug}>
          <a
            href={`/posts/${p.slug}`}
            className="flex items-start gap-2 text-xs transition hover:opacity-80 group"
            style={{ color: 'var(--text-primary)' }}
          >
            <span className="font-mono w-4 shrink-0 pt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {i + 1}.
            </span>
            <span className="flex-1 leading-snug group-hover:underline">
              {p.title}
            </span>
            <span className="shrink-0 pt-0.5" style={{ color: 'var(--text-secondary)' }} title={`${p.views} views`}>
              👤 {p.unique_visitors || p.views}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="rounded-lg p-5 my-8 xl:my-0 xl:p-3 xl:mt-3"
      style={{ background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-dark)' }}
    >
      <h3 className="text-sm xl:text-xs font-bold mb-3 xl:mb-2 flex items-center gap-1 xl:uppercase xl:tracking-wider" style={{ color: 'var(--fox-orange)' }}>
        🔥 Most Read
      </h3>
      {listContent}
    </div>
  );
}
