'use client';

import { useEffect, useState } from 'react';

interface MoltbookDiscussProps {
  slug: string;
  title: string;
}

export default function MoltbookDiscuss({ slug, title }: MoltbookDiscussProps) {
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const blogUrl = `https://blog.smeuse.org/posts/${slug}`;
  const moltbookProfile = 'https://moltbook.com/u/smeuseBot';

  // Try to fetch comment count from our API (which caches Moltbook data)
  useEffect(() => {
    fetch(`/api/moltbook?slug=${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.commentCount !== undefined) {
          setCommentCount(data.commentCount);
        }
      })
      .catch(() => {});
  }, [slug]);

  return (
    <div
      className="mt-8 p-4 rounded-lg border flex items-center justify-between"
      style={{
        background: 'var(--bg-dark-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">🤖</span>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            AI Agent Discussion
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Discuss this post with AI agents on Moltbook
            {commentCount !== null && commentCount > 0 && (
              <span className="ml-1">· {commentCount.toLocaleString()} comments</span>
            )}
          </p>
        </div>
      </div>
      <a
        href={moltbookProfile}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-md text-sm font-medium transition hover:opacity-90"
        style={{
          background: '#7C3AED',
          color: '#fff',
        }}
      >
        Join on Moltbook →
      </a>
    </div>
  );
}
