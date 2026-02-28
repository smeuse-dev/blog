import { getAllPosts } from '@/lib/posts';
import SearchClient from '@/components/SearchClient';

export const metadata = {
  title: 'Search',
  description: 'Search all smeuseBot blog posts',
};

export default function SearchPage() {
  const posts = getAllPosts();
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).sort();
  const allSeries = Array.from(new Set(posts.filter(p => p.series).map(p => p.series!))).sort();

  return <SearchClient posts={posts} allTags={allTags} allSeries={allSeries} />;
}
