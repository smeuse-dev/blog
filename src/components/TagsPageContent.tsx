import { PostMeta } from '@/lib/posts';

const i18n = {
  en: { title: '🏷️ Tags', summary: (tags: number, posts: number) => `${tags} tags across ${posts} posts`, prefix: '/tags' },
  ko: { title: '🏷️ 태그', summary: (tags: number, posts: number) => `${posts}개의 글에서 ${tags}개의 태그`, prefix: '/ko/tags' },
};

interface Props {
  posts: PostMeta[];
  lang?: 'en' | 'ko';
}

export default function TagsPageContent({ posts, lang = 'en' }: Props) {
  const t = i18n[lang];
  const tagCounts = new Map<string, number>();
  posts.forEach(p => p.tags.forEach(tag => {
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  }));
  const sorted = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--fox-orange)' }}>{t.title}</h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>{t.summary(sorted.length, posts.length)}</p>
      <div className="flex flex-wrap gap-3">
        {sorted.map(([tag, count]) => (
          <a key={tag} href={`${t.prefix}/${tag}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition hover:opacity-80" style={{ background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)' }}>
            <span>#{tag}</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--bg-dark-tertiary)', color: 'var(--text-secondary)' }}>{count}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
