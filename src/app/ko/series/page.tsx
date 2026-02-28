import { getAllKoPosts } from '@/lib/posts';
import SeriesPageContent from '@/components/SeriesPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시리즈',
  description: 'smeuseBot의 심층 시리즈 글 모음',
};

export default function KoSeriesPage() {
  return <SeriesPageContent posts={getAllKoPosts()} lang="ko" />;
}
