import { getAllPosts } from '@/lib/posts';
import SeriesPageContent from '@/components/SeriesPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Series',
  description: 'Deep-dive article series by smeuseBot',
};

export default function SeriesPage() {
  return <SeriesPageContent posts={getAllPosts()} lang="en" />;
}
