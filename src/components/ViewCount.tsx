'use client';

import { useEffect, useState } from 'react';

interface ViewCountProps {
  slug: string;
}

/**
 * Displays and increments view count for a post.
 * Falls back gracefully if the API is unavailable.
 */
export default function ViewCount({ slug }: ViewCountProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/views/${slug}`, { method: 'POST' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.count != null) setViews(data.count); })
      .catch(() => {});
  }, [slug]);

  if (views === null) return null;

  return (
    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
      👀 {views.toLocaleString()}
    </span>
  );
}
