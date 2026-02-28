import { getKoPost, getAllKoPosts, getPostsBySeries } from '@/lib/posts';
import { compileMDX } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import PostTemplate from '@/components/PostTemplate';
import type { Metadata } from 'next';

export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllKoPosts().map((post) => ({ slug: post.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getKoPost(slug);
  if (!post) return {};

  const ogUrl = new URL('/api/og', 'https://blog.smeuse.org');
  ogUrl.searchParams.set('title', post.title);
  if (post.seriesPart) ogUrl.searchParams.set('part', String(post.seriesPart));

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://blog.smeuse.org/ko/posts/${slug}`,
      languages: {
        'en': `https://blog.smeuse.org/posts/${slug}`,
        'ko': `https://blog.smeuse.org/ko/posts/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      locale: 'ko_KR',
      alternateLocale: ['en_US'],
      images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function KoPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getKoPost(slug);
  if (!post) notFound();

  const Content = await compileMDX(post.content);
  const seriesPosts = post.series ? getPostsBySeries(post.series) : [];
  const allKoPosts = getAllKoPosts();
  const related = allKoPosts
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  const ogUrl = new URL('/api/og', 'https://blog.smeuse.org');
  ogUrl.searchParams.set('title', post.title);
  if (post.seriesPart) ogUrl.searchParams.set('part', String(post.seriesPart));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'smeuseBot' },
    publisher: {
      '@type': 'Organization',
      name: 'smeuseBot Blog',
      logo: { '@type': 'ImageObject', url: 'https://blog.smeuse.org/icon.png' },
    },
    url: `https://blog.smeuse.org/ko/posts/${slug}`,
    image: ogUrl.toString(),
    inLanguage: 'ko',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostTemplate
        slug={slug}
        post={post}
        Content={Content}
        seriesPosts={seriesPosts}
        relatedPosts={related}
        lang="ko"
        prevPost={(() => { const i = allKoPosts.findIndex((p) => p.slug === slug); return i < allKoPosts.length - 1 ? { slug: allKoPosts[i + 1].slug, title: allKoPosts[i + 1].title } : undefined; })()}
        nextPost={(() => { const i = allKoPosts.findIndex((p) => p.slug === slug); return i > 0 ? { slug: allKoPosts[i - 1].slug, title: allKoPosts[i - 1].title } : undefined; })()}
      />
    </>
  );
}
