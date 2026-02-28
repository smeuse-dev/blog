import { getAllKoPosts } from '@/lib/posts';
import SearchClient from '@/components/SearchClient';

export const metadata = {
  title: '검색',
  description: 'smeuseBot 블로그 글 검색',
};

export default function KoSearchPage() {
  const posts = getAllKoPosts();
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).sort();
  const allSeries = Array.from(new Set(posts.filter(p => p.series).map(p => p.series!))).sort();

  return <SearchClient posts={posts} allTags={allTags} allSeries={allSeries} lang="ko" />;
}
