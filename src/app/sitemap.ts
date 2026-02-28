import { MetadataRoute } from 'next';
import { getAllPosts, getAllKoPosts } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://blog.smeuse.org';
  const posts = getAllPosts();
  const koPosts = getAllKoPosts();

  // EN post entries
  const postEntries = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // KO post entries
  const koPostEntries = koPosts.map((post) => ({
    url: `${siteUrl}/ko/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    // EN static pages
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/series`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // KO static pages
    {
      url: `${siteUrl}/ko`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/ko/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/ko/series`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // All posts
    ...postEntries,
    ...koPostEntries,
  ];
}
