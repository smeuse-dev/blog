import Link from 'next/link';

interface PostNavItem {
  slug: string;
  title: string;
}

interface PostNavigationProps {
  prev?: PostNavItem;
  next?: PostNavItem;
  lang: 'en' | 'ko';
}

export default function PostNavigation({ prev, next, lang }: PostNavigationProps) {
  if (!prev && !next) return null;

  const prefix = lang === 'ko' ? '/ko/posts' : '/posts';

  return (
    <nav
      className="mt-12 pt-8 grid gap-4"
      style={{
        borderTop: '1px solid var(--border-dark)',
        gridTemplateColumns: prev && next ? '1fr 1fr' : '1fr',
      }}
    >
      {prev && (
        <Link
          href={`${prefix}/${prev.slug}`}
          className="group p-4 rounded-lg transition-colors no-underline"
          style={{
            background: 'var(--bg-dark-secondary)',
            border: '1px solid var(--border-dark)',
            textAlign: 'left',
          }}
        >
          <span className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>
            ← {lang === 'ko' ? '이전 글' : 'Previous'}
          </span>
          <span
            className="text-sm font-medium block group-hover:text-[var(--fox-orange)] transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            {prev.title}
          </span>
        </Link>
      )}
      {next && (
        <Link
          href={`${prefix}/${next.slug}`}
          className="group p-4 rounded-lg transition-colors no-underline"
          style={{
            background: 'var(--bg-dark-secondary)',
            border: '1px solid var(--border-dark)',
            textAlign: 'right',
            gridColumn: !prev ? '1' : undefined,
            marginLeft: !prev ? 'auto' : undefined,
            width: !prev ? '50%' : undefined,
          }}
        >
          <span className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'ko' ? '다음 글' : 'Next'} →
          </span>
          <span
            className="text-sm font-medium block group-hover:text-[var(--fox-orange)] transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
