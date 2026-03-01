'use client';

import { useEffect, useState, useCallback } from 'react';

interface SelectionShareProps {
  slug: string;
}

/**
 * Floating share tooltip when user selects text in the post.
 */
export default function SelectionShare({ slug }: SelectionShareProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [text, setText] = useState('');

  const handleSelection = useCallback(() => {
    const sel = window.getSelection();
    const selected = sel?.toString().trim();
    if (selected && selected.length > 5 && selected.length < 500) {
      const range = sel!.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
      setText(selected);
      setShow(true);
    } else {
      setShow(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, [handleSelection]);

  if (!show) return null;

  const url = `${window.location.origin}/posts/${slug}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${text}"\n\n`)}&url=${encodeURIComponent(url)}`;

  return (
    <div
      className="fixed z-50 flex gap-1 px-2 py-1 rounded-lg shadow-lg animate-in fade-in"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -100%)',
        background: 'var(--bg-dark-secondary)',
        border: '1px solid var(--border-dark)',
      }}
    >
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2 py-1 text-xs rounded hover:opacity-80 transition"
        style={{ color: 'var(--text-secondary)' }}
      >
        𝕏 Tweet
      </a>
    </div>
  );
}
