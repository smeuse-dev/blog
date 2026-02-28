import { getAllPosts, PostMeta } from '@/lib/posts';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default function Home() {
  const posts = getAllPosts();
  
  // Featured: most recent series post or first post
  const featured = posts.find(p => p.series) || posts[0];
  
  // All unique tags
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).sort();
  
  // All unique series
  const allSeries = Array.from(new Set(posts.filter(p => p.series).map(p => p.series!))).sort();
  
  return (
    <HomeClient 
      posts={posts} 
      featured={featured} 
      allTags={allTags}
      allSeries={allSeries}
      totalPosts={posts.length}
    />
  );
}
