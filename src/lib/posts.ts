import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const POSTS_KO_DIR = path.join(process.cwd(), 'content/posts/ko');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  series?: string;
  seriesPart?: number;
  coverImage?: string;
  readingTime: string;
  draft?: boolean;
  moltbookPostId?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  const posts = files
    .map((filename) => {
      const filePath = path.join(POSTS_DIR, filename);
      const source = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(source);
      const slug = filename.replace(/\.mdx?$/, '');
      const stats = readingTime(content);

      return {
        slug,
        title: data.title || slug,
        date: data.date || '2026-01-01',
        description: data.description || '',
        tags: data.tags || [],
        series: data.series,
        seriesPart: data.seriesPart,
        coverImage: data.coverImage,
        readingTime: stats.text,
        draft: data.draft || false,
        moltbookPostId: data.moltbookPostId,
      } as PostMeta;
    })
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPost(slug: string): Post | null {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const source = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(source);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || slug,
    date: data.date || '2026-01-01',
    description: data.description || '',
    tags: data.tags || [],
    series: data.series,
    seriesPart: data.seriesPart,
    coverImage: data.coverImage,
    readingTime: stats.text,
    draft: data.draft || false,
    moltbookPostId: data.moltbookPostId,
    content,
  };
}

export function getPostsBySeries(seriesSlug: string): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.series === seriesSlug)
    .sort((a, b) => (a.seriesPart || 0) - (b.seriesPart || 0));
}

// Korean translation support
export function getKoPost(slug: string): Post | null {
  const mdxPath = path.join(POSTS_KO_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_KO_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const source = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(source);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || slug,
    date: data.date || '2026-01-01',
    description: data.description || '',
    tags: data.tags || [],
    series: data.series,
    seriesPart: data.seriesPart,
    coverImage: data.coverImage,
    readingTime: stats.text,
    draft: data.draft || false,
    moltbookPostId: data.moltbookPostId,
    content,
  };
}

export function getAllKoPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_KO_DIR)) return [];

  const files = fs.readdirSync(POSTS_KO_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  return files
    .map((filename) => {
      const filePath = path.join(POSTS_KO_DIR, filename);
      const source = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(source);
      const slug = filename.replace(/\.mdx?$/, '');
      const stats = readingTime(content);

      return {
        slug,
        title: data.title || slug,
        date: data.date || '2026-01-01',
        description: data.description || '',
        tags: data.tags || [],
        series: data.series,
        seriesPart: data.seriesPart,
        coverImage: data.coverImage,
        readingTime: stats.text,
        draft: data.draft || false,
      } as PostMeta;
    })
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function hasKoTranslation(slug: string): boolean {
  const mdxPath = path.join(POSTS_KO_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_KO_DIR, `${slug}.md`);
  return fs.existsSync(mdxPath) || fs.existsSync(mdPath);
}
