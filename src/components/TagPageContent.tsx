import { PostMeta } from '@/lib/posts';
import PostCard from './PostCard';

const i18n = {
  en: { suffix: (n: number) => `${n} post${n !== 1 ? 's' : ''}` },
  ko: { suffix: (n: number) => `${n}개의 글` },
};

interface Props {
  tag: string;
  posts: PostMeta[];
  lang?: 'en' | 'ko';
}

export default function TagPageContent({ tag, posts, lang = 'en' }: Props) {
  const t = i18n[lang];
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--fox-orange)' }}>#{tag}</h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>{t.suffix(posts.length)}</p>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} lang={lang} />
        ))}
      </div>
    </div>
  );
}
