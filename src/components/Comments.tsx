'use client';

import { useEffect, useRef } from 'react';

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.querySelector('.giscus')) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'smeuse-dev/blog');
    script.setAttribute('data-repo-id', 'R_kgDORLRg7A');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDORLRg7M4C2CfX');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'dark_dimmed');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('crossOrigin', 'anonymous');
    script.async = true;

    ref.current.appendChild(script);
  }, []);

  return (
    <div className="mt-12 w-full">
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        💬 Comments
      </h3>
      <div ref={ref} className="w-full [&_.giscus]:w-full [&_iframe]:w-full" />
    </div>
  );
}
