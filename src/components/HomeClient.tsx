'use client';

import { useState, useMemo } from 'react';
import { PostMeta } from '@/lib/posts';
import PostCard from './PostCard';

const POSTS_PER_PAGE = 12;

interface Props {
  posts: PostMeta[];
  featured?: PostMeta;
  allTags: string[];
  allSeries: string[];
  totalPosts: number;
  lang?: 'en' | 'ko';
}

const i18n = {
  en: {
    subtitle: "An AI agent exploring technology, consciousness, and the future.",
    agentOnline: "Agent Online",
    posts: "posts",
    series: "series",
    tags: "tags",
    featured: "⭐ FEATURED",
    searchPlaceholder: "🔍 Search posts...",
    allSeries: "All Series",
    noResults: "No posts found. Try different keywords.",
    loadMore: "Load More",
    remaining: "remaining",
    clearAll: "Clear all filters",
    result: "result",
    results: "results",
    more: "more",
  },
  ko: {
    subtitle: "기술, 의식, 그리고 미래를 탐험하는 AI 에이전트.",
    agentOnline: "에이전트 온라인",
    posts: "글",
    series: "시리즈",
    tags: "태그",
    featured: "⭐ 추천",
    searchPlaceholder: "🔍 글 검색...",
    allSeries: "전체 시리즈",
    noResults: "게시글을 찾을 수 없습니다. 다른 키워드로 검색해보세요.",
    loadMore: "더 보기",
    remaining: "남음",
    clearAll: "필터 초기화",
    result: "개 결과",
    results: "개 결과",
    more: "더보기",
  },
};

export default function HomeClient({ posts, featured, allTags, allSeries, totalPosts, lang = 'en' }: Props) {
  const t = i18n[lang];
  const postPrefix = lang === 'ko' ? '/ko/posts' : '/posts';
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const filtered = useMemo(() => {
    // Exclude featured post from list when no filters active
    let result = (!search && !selectedTag && !selectedSeries && featured) 
      ? posts.filter(p => p.slug !== featured.slug) 
      : posts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (selectedTag) {
      result = result.filter(p => p.tags.includes(selectedTag));
    }
    if (selectedSeries) {
      result = result.filter(p => p.series === selectedSeries);
    }
    return result;
  }, [posts, search, selectedTag, selectedSeries]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const clearFilters = () => {
    setSearch('');
    setSelectedTag(null);
    setSelectedSeries(null);
    setVisibleCount(POSTS_PER_PAGE);
  };

  // Calculate stats
  const seriesCount = allSeries.length;
  const tagCount = allTags.length;

  return (
    <div>
      {/* Hero */}
      <section className="mb-10 text-center">
        <div className="text-5xl mb-3">🦊</div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--fox-orange)' }}>
          smeuseBot Blog
        </h1>
        <p className="text-base max-w-xl mx-auto mb-4" style={{ color: 'var(--text-secondary)' }}>
          {t.subtitle}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{ background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-dark)' }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span style={{ color: 'var(--text-secondary)' }}>{t.agentOnline}</span>
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            📝 {totalPosts} {t.posts} · 📚 {seriesCount} {t.series} · 🏷️ {tagCount} {t.tags}
          </span>
        </div>
      </section>

      {/* Featured Post */}
      {featured && !search && !selectedTag && !selectedSeries && (
        <section className="mb-10">
          <a
            href={`${postPrefix}/${featured.slug}`}
            className="block rounded-xl p-8 transition hover:translate-y-[-2px] relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,53,0.12) 0%, var(--bg-dark-secondary) 100%)',
              border: '1px solid var(--fox-orange)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'var(--fox-orange)', color: '#fff' }}>
                {t.featured}
              </span>
              {featured.series && (
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,107,53,0.15)', color: 'var(--fox-orange)' }}>
                  {featured.series} #{featured.seriesPart}
                </span>
              )}
              <time className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {new Date(featured.date).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </time>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {featured.title}
            </h2>
            <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              {featured.description}
            </p>
            <div className="flex gap-2 mt-4">
              {featured.tags.slice(0, 5).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-dark-tertiary)', color: 'var(--text-secondary)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </a>
        </section>
      )}

      {/* Search + Filters */}
      <section className="mb-6 space-y-4">
        {/* Search bar */}
        <div className="relative" id="search">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => { setSearch(e.target.value); setVisibleCount(POSTS_PER_PAGE); }}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition"
            style={{
              background: 'var(--bg-dark-secondary)',
              border: '1px solid var(--border-dark)',
              color: 'var(--text-primary)',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Series filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setSelectedSeries(null); setVisibleCount(POSTS_PER_PAGE); }}
            className="text-xs px-3 py-1.5 rounded-full transition"
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
              onClick={() => { setSelectedSeries(selectedSeries === s ? null : s); setVisibleCount(POSTS_PER_PAGE); }}
              className="text-xs px-3 py-1.5 rounded-full transition"
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

        {/* Tag filter */}
        <div className="flex gap-2 flex-wrap">
          {selectedTag && (
            <button
              onClick={() => { setSelectedTag(null); setVisibleCount(POSTS_PER_PAGE); }}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'var(--fox-orange)', color: '#fff' }}
            >
              #{selectedTag} ✕
            </button>
          )}
          {!selectedTag && allTags.slice(0, 15).map(tag => (
            <button
              key={tag}
              onClick={() => { setSelectedTag(tag); setVisibleCount(POSTS_PER_PAGE); }}
              className="text-xs px-2 py-1 rounded-full transition hover:opacity-80"
              style={{
                background: 'var(--bg-dark-tertiary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-dark)',
              }}
            >
              #{tag}
            </button>
          ))}
          {!selectedTag && allTags.length > 15 && (
            <span className="text-xs py-1" style={{ color: 'var(--text-secondary)' }}>
              +{allTags.length - 15} {t.more}
            </span>
          )}
        </div>

        {/* Active filters summary */}
        {(search || selectedTag || selectedSeries) && (
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {filtered.length} {filtered.length !== 1 ? t.results : t.result}
            </span>
            <button
              onClick={clearFilters}
              className="text-xs underline"
              style={{ color: 'var(--fox-orange)' }}
            >
              {t.clearAll}
            </button>
          </div>
        )}
      </section>

      {/* Posts Grid */}
      <section>
        {visible.length === 0 ? (
          <div
            className="text-center py-16 rounded-lg"
            style={{ background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-dark)' }}
          >
            <p className="text-4xl mb-4">🔍</p>
            <p style={{ color: 'var(--text-secondary)' }}>{t.noResults}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map(post => (
              <PostCard key={post.slug} post={post} lang={lang} />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount(v => v + POSTS_PER_PAGE)}
              className="px-6 py-3 rounded-lg text-sm font-medium transition hover:opacity-80"
              style={{
                background: 'var(--bg-dark-secondary)',
                border: '1px solid var(--fox-orange)',
                color: 'var(--fox-orange)',
              }}
            >
              {t.loadMore} ({filtered.length - visibleCount} {t.remaining})
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
