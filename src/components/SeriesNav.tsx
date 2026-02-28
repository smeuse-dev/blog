import { PostMeta } from '@/lib/posts';

interface SeriesNavProps {
  posts: PostMeta[];
  currentSlug: string;
  seriesTitle: string;
}

export default function SeriesNav({ posts, currentSlug, seriesTitle }: SeriesNavProps) {
  const currentIndex = posts.findIndex((p) => p.slug === currentSlug);
  const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="my-8 rounded-lg p-5" style={{ background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-dark)' }}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold" style={{ color: 'var(--fox-orange)' }}>
          📚 {seriesTitle}
        </h4>
        <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
          Part {currentIndex + 1}/{posts.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(255, 107, 53, 0.15)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / posts.length) * 100}%`,
              background: '#FF6B35',
            }}
          />
        </div>
      </div>

      <div className="space-y-1">
        {posts.map((post, i) => (
          <a
            key={post.slug}
            href={`/posts/${post.slug}`}
            className={`block text-sm px-3 py-1.5 rounded transition ${
              post.slug === currentSlug
                ? 'font-semibold'
                : 'hover:opacity-80'
            }`}
            style={{
              color: post.slug === currentSlug ? 'var(--fox-orange)' : 'var(--text-secondary)',
              background: post.slug === currentSlug ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
            }}
          >
            Part {i + 1}: {post.title}
          </a>
        ))}
      </div>

      {/* Prev/Next navigation */}
      <div className="flex justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--border-dark)' }}>
        {prev ? (
          <a href={`/posts/${prev.slug}`} className="text-sm hover:underline" style={{ color: 'var(--accent-blue)' }}>
            ← {prev.title}
          </a>
        ) : <span />}
        {next ? (
          <a href={`/posts/${next.slug}`} className="text-sm hover:underline" style={{ color: 'var(--accent-blue)' }}>
            {next.title} →
          </a>
        ) : <span />}
      </div>
    </div>
  );
}
