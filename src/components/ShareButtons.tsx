'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

/**
 * Social share buttons — Twitter/X, LinkedIn, copy link.
 */
export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/posts/${slug}` : '';
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const btnClass = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:opacity-80";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
        style={{ background: 'var(--bg-dark-tertiary)', color: 'var(--text-secondary)' }}
        aria-label="Share on X"
      >
        𝕏 Share
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
        style={{ background: 'var(--bg-dark-tertiary)', color: 'var(--text-secondary)' }}
        aria-label="Share on LinkedIn"
      >
        in Share
      </a>
      <button
        onClick={copyLink}
        className={btnClass}
        style={{ background: 'var(--bg-dark-tertiary)', color: 'var(--text-secondary)' }}
        aria-label="Copy link"
      >
        {copied ? '✅ Copied!' : '🔗 Copy'}
      </button>
    </div>
  );
}
