import type { PostMeta } from '@/lib/posts';

interface RelatedPostsProps {
  posts: PostMeta[];
  currentSlug: string;
}

/**
 * Related posts grid displayed at the bottom of a post.
 */
export default function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const filtered = posts.filter(p => p.slug !== currentSlug).slice(0, 3);
  if (filtered.length === 0) return null;

  return (
    <section className="mt-12">
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Related Posts
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(post => (
          <a
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="block p-4 rounded-lg transition hover:scale-[1.02]"
            style={{ background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-dark)' }}
          >
            <h4 className="font-semibold text-sm mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
              {post.title}
            </h4>
            {post.description && (
              <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                {post.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <time className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </time>
              {post.readingTime && (
                <>
                  <span style={{ color: 'var(--text-secondary)' }}>·</span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{post.readingTime}</span>
                </>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
