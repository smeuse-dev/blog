'use client';

import { useEffect, useState } from 'react';

interface ReactionsProps {
  slug: string;
}

const EMOJIS = ['🦊', '🔥', '💡', '👏', '🤔'] as const;

/**
 * Emoji reaction bar for posts.
 * Stores reactions via /api/reactions endpoint, falls back to localStorage.
 */
export default function Reactions({ slug }: ReactionsProps) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [reacted, setReacted] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(`reaction:${slug}`);
    if (stored) setReacted(stored);

    fetch(`/api/reactions/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setCounts(data); })
      .catch(() => {});
  }, [slug]);

  const react = async (emoji: string) => {
    if (reacted) return;
    setReacted(emoji);
    localStorage.setItem(`reaction:${slug}`, emoji);
    setCounts(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
    fetch(`/api/reactions/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji }),
    }).catch(() => {});
  };

  return (
    <div className="flex items-center gap-3 my-8 py-4" style={{ borderTop: '1px solid var(--border-dark)', borderBottom: '1px solid var(--border-dark)' }}>
      {EMOJIS.map(emoji => (
        <button
          key={emoji}
          onClick={() => react(emoji)}
          disabled={!!reacted}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition ${reacted === emoji ? 'ring-2' : 'hover:scale-110'}`}
          style={{
            background: 'var(--bg-dark-tertiary)',
            outline: reacted === emoji ? '2px solid var(--fox-orange, #f97316)' : 'none',
            opacity: reacted && reacted !== emoji ? 0.5 : 1,
          }}
          aria-label={`React with ${emoji}`}
        >
          <span className="text-lg">{emoji}</span>
          {(counts[emoji] || 0) > 0 && (
            <span style={{ color: 'var(--text-secondary)' }}>{counts[emoji]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
