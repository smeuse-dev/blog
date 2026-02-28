'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { PostMeta } from '@/lib/posts';
import PostCard from './PostCard';

interface Props {
  posts: PostMeta[];
  allTags: string[];
  allSeries: string[];
  lang?: 'en' | 'ko';
}

export default function SearchClient({ posts, allTags, allSeries, lang = 'en' }: Props) {
  const t = lang === 'ko' ? {
    title: '🔍 글 검색',
    placeholder: '제목, 설명, 태그로 검색...',
    allSeries: '전체 시리즈',
    results: (n: number) => `${n}개의 결과`,
    clearAll: '전체 해제',
    noResults: '검색 결과가 없습니다. 다른 키워드를 시도해보세요.',
    more: (n: number) => `+${n}개 더`,
  } : {
    title: '🔍 Search Posts',
    placeholder: 'Type to search titles, descriptions, tags...',
    allSeries: 'All Series',
    results: (n: number) => `${n} result${n !== 1 ? 's' : ''}`,
    clearAll: 'Clear all',
    noResults: 'No posts found. Try different keywords.',
    more: (n: number) => `+${n} more`,
  };
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    let result = posts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (selectedTag) result = result.filter(p => p.tags.includes(selectedTag));
    if (selectedSeries) result = result.filter(p => p.series === selectedSeries);
    return result;
  }, [posts, search, selectedTag, selectedSeries]);

  const clearFilters = () => {
    setSearch('');
    setSelectedTag(null);
    setSelectedSeries(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--fox-orange)' }}>
        {t.title}
      </h1>

      {/* Search input */}
      <input
        ref={inputRef}
        type="text"
        placeholder={t.placeholder}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-lg text-base outline-none mb-4"
        style={{
          background: 'var(--bg-dark-secondary)',
          border: '1px solid var(--border-dark)',
          color: 'var(--text-primary)',
        }}
      />

      {/* Series filter */}
      <div className="flex gap-2 flex-wrap mb-3">
        <button
          onClick={() => setSelectedSeries(null)}
          className="text-xs px-3 py-1.5 rounded-full"
          style={{
            background: !selectedSeries ? 'var(--fox-orange)' : 'var(--bg-dark-secondary)',
            color: !selectedSeries ? '#fff' : 'var(--text-secondary)',
            border: '1px solid ' + (!selectedSeries ? 'var(--fox-orange)' : 'var(--border-dark)'),
          }}
        >
          {t.allSeries}
        </button>
        {allSeries.map(s => (
          <button
            key={s}
            onClick={() => setSelectedSeries(selectedSeries === s ? null : s)}
            className="text-xs px-3 py-1.5 rounded-full"
            style={{
              background: selectedSeries === s ? 'var(--fox-orange)' : 'var(--bg-dark-secondary)',
              color: selectedSeries === s ? '#fff' : 'var(--text-secondary)',
              border: '1px solid ' + (selectedSeries === s ? 'var(--fox-orange)' : 'var(--border-dark)'),
            }}
          >
            📚 {s}
          </button>
        ))}
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap mb-4">
        {selectedTag ? (
          <button
            onClick={() => setSelectedTag(null)}
            className="text-xs px-3 py-1.5 rounded-full"
            style={{ background: 'var(--fox-orange)', color: '#fff' }}
          >
            #{selectedTag} ✕
          </button>
        ) : (
          allTags.slice(0, 20).map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className="text-xs px-2 py-1 rounded-full hover:opacity-80"
              style={{
                background: 'var(--bg-dark-tertiary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-dark)',
              }}
            >
              #{tag}
            </button>
          ))
        )}
        {!selectedTag && allTags.length > 20 && (
          <span className="text-xs py-1" style={{ color: 'var(--text-secondary)' }}>{t.more(allTags.length - 20)}</span>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t.results(filtered.length)}
        </span>
        {(search || selectedTag || selectedSeries) && (
          <button onClick={clearFilters} className="text-xs underline" style={{ color: 'var(--fox-orange)' }}>
            {t.clearAll}
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-16 rounded-lg"
          style={{ background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-dark)' }}
        >
          <p className="text-4xl mb-4">🦊</p>
          <p style={{ color: 'var(--text-secondary)' }}>{t.noResults}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(post => (
            <PostCard key={post.slug} post={post} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
