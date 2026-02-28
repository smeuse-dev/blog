import { getAllPosts } from '@/lib/posts';
import TagsPageContent from '@/components/TagsPageContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse all tags',
};

export default function TagsPage() {
  return <TagsPageContent posts={getAllPosts()} lang="en" />;
}
