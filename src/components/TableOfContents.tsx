'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const els = article.querySelectorAll('h2, h3');
    const items: TocItem[] = Array.from(els).map((el) => ({
      id: el.id || el.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '',
      text: el.textContent || '',
      level: el.tagName === 'H2' ? 2 : 3,
    }));
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    els.forEach((el) => {
      if (el.id) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (headings.length < 3) return null;

  const tocList = (
    <ul className="space-y-1">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={() => setIsOpen(false)}
            className="text-xs block py-0.5 transition-all duration-200 hover:opacity-80 truncate"
            style={{
              color: activeId === h.id ? 'var(--fox-orange)' : 'var(--text-secondary)',
              fontWeight: activeId === h.id ? 600 : 400,
              borderLeft: activeId === h.id ? '2px solid var(--fox-orange)' : '2px solid transparent',
              paddingLeft: h.level === 3 ? '1.25rem' : '0.5rem',
            }}
            title={h.text}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop: Clean card (rendered inside Sidebar's aside) */}
      <div
        className="hidden xl:block p-3 rounded-lg"
        style={{
          background: 'var(--bg-dark-secondary)',
          border: '1px solid var(--border-dark)',
          opacity: 0.95,
        }}
      >
        <h4 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--fox-orange)' }}>
          On this page
        </h4>
        {tocList}
      </div>

      {/* Mobile/Tablet: Collapsible inline */}
      <nav
        className="xl:hidden my-8 rounded-lg"
        style={{ background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-dark)' }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 text-left"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <h4 className="text-sm font-bold" style={{ color: 'var(--fox-orange)' }}>
            📑 Table of Contents
          </h4>
          <span
            className="text-xs transition-transform duration-200"
            style={{
              color: 'var(--text-secondary)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▼
          </span>
        </button>
        {isOpen && <div className="px-4 pb-4">{tocList}</div>}
      </nav>
    </>
  );
}
