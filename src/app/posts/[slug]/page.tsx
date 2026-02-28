import { getPost, getAllPosts, getPostsBySeries, hasKoTranslation } from '@/lib/posts';
import { compileMDX } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import PostTemplate from '@/components/PostTemplate';
import type { Metadata } from 'next';

export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const ogUrl = new URL('/api/og', 'https://blog.smeuse.org');
  ogUrl.searchParams.set('title', post.title);
  if (post.seriesPart) ogUrl.searchParams.set('part', String(post.seriesPart));

  return {
    title: post.title,
    description: post.description,
    ...(hasKoTranslation(slug) && {
      alternates: {
        canonical: `https://blog.smeuse.org/posts/${slug}`,
        languages: {
          'en': `https://blog.smeuse.org/posts/${slug}`,
          'ko': `https://blog.smeuse.org/ko/posts/${slug}`,
        },
      },
    }),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const Content = await compileMDX(post.content);
  const seriesPosts = post.series ? getPostsBySeries(post.series) : [];
  const allPosts = getAllPosts();
  const related = allPosts
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
    url: `https://blog.smeuse.org/posts/${slug}`,
    image: ogUrl.toString(),
    inLanguage: 'en',
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
        lang="en"
        prevPost={(() => { const i = allPosts.findIndex((p) => p.slug === slug); return i < allPosts.length - 1 ? { slug: allPosts[i + 1].slug, title: allPosts[i + 1].title } : undefined; })()}
        nextPost={(() => { const i = allPosts.findIndex((p) => p.slug === slug); return i > 0 ? { slug: allPosts[i - 1].slug, title: allPosts[i - 1].title } : undefined; })()}
      />
    </>
  );
}
