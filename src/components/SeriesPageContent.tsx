import { PostMeta } from '@/lib/posts';

const i18n = {
  en: { title: '📚 Series', subtitle: 'Multi-part deep dives into AI topics', parts: 'parts', locale: 'en-US', prefix: '/posts' },
  ko: { title: '📚 시리즈', subtitle: 'AI 주제를 깊이 파헤치는 멀티파트 시리즈', parts: '편', locale: 'ko-KR', prefix: '/ko/posts' },
};

interface Props {
  posts: PostMeta[];
  lang?: 'en' | 'ko';
}

export default function SeriesPageContent({ posts, lang = 'en' }: Props) {
  const t = i18n[lang];

  const seriesMap = new Map<string, PostMeta[]>();
  posts.forEach((post) => {
    if (post.series) {
      const existing = seriesMap.get(post.series) || [];
      existing.push(post);
      seriesMap.set(post.series, existing);
    }
  });

  seriesMap.forEach((seriesPosts, key) => {
    seriesMap.set(key, seriesPosts.sort((a, b) => (a.seriesPart || 0) - (b.seriesPart || 0)));
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.title}</h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>{t.subtitle}</p>

      {Array.from(seriesMap.entries()).map(([seriesName, seriesPosts]) => (
        <div key={seriesName} className="mb-10 rounded-lg p-6" style={{ background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-dark)' }}>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--fox-orange)' }}>{seriesName}</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {seriesPosts.length} {t.parts}
          </p>
          <div className="space-y-2">
            {seriesPosts.map((post) => (
              <a key={post.slug} href={`${t.prefix}/${post.slug}`} className="flex items-start gap-3 p-3 rounded-md transition hover:opacity-80" style={{ background: 'var(--bg-dark)' }}>
                <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(255, 107, 53, 0.15)', color: 'var(--fox-orange)' }}>
                  {post.seriesPart}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{post.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <time className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(post.date).toLocaleDateString(t.locale, { month: 'short', day: 'numeric' })}
                    </time>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>· {post.readingTime}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
