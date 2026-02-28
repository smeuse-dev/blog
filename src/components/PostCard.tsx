import { PostMeta } from '@/lib/posts';

export default function PostCard({ post, lang = 'en' }: { post: PostMeta; lang?: 'en' | 'ko' }) {
  const prefix = lang === 'ko' ? '/ko/posts' : '/posts';
  return (
    <a
      href={`${prefix}/${post.slug}`}
      className="block rounded-lg p-6 transition hover:translate-y-[-2px]"
      style={{
        background: 'var(--bg-dark-secondary)',
        border: '1px solid var(--border-dark)',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <time className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {new Date(post.date).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          · {post.readingTime}
        </span>
        {post.series && (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: 'rgba(255, 107, 53, 0.15)', color: 'var(--fox-orange)' }}
          >
            {post.series} #{post.seriesPart}
          </span>
        )}
      </div>

      <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        {post.title}
      </h2>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {post.description}
      </p>

      <div className="flex gap-2 mt-4">
        {post.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: 'var(--bg-dark-tertiary)', color: 'var(--text-secondary)' }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </a>
  );
}
