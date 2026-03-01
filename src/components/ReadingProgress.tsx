'use client';

import { useEffect, useState } from 'react';

/**
 * Reading progress bar fixed at the top of the viewport.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? Math.min((scrollTop / total) * 100, 100) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50" style={{ background: 'transparent' }}>
      <div
        className="h-full transition-[width] duration-150"
        style={{ width: `${progress}%`, background: 'var(--fox-orange, #f97316)' }}
      />
    </div>
  );
}
