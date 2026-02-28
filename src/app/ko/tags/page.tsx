import { getAllKoPosts } from '@/lib/posts';
import TagsPageContent from '@/components/TagsPageContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '태그',
  description: '모든 태그 둘러보기',
};

export default function KoTagsPage() {
  return <TagsPageContent posts={getAllKoPosts()} lang="ko" />;
}
