import { getAllKoPosts } from '@/lib/posts';
import TagPageContent from '@/components/TagPageContent';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ tag: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = getAllKoPosts();
  const tags = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `#${tag} 태그가 달린 글`,
    alternates: {
      canonical: `https://blog.smeuse.org/ko/tags/${tag}`,
    },
  };
}

export default async function KoTagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getAllKoPosts().filter((p) => p.tags.some((t) => t.toLowerCase() === decoded.toLowerCase()));
  if (posts.length === 0) notFound();
  return <TagPageContent tag={decoded} posts={posts} lang="ko" />;
}
