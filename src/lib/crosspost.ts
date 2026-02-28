/**
 * Moltbook Crosspost Worker
 * - Scans MDX files without moltbookPostId
 * - Posts to Moltbook API (1 per run, 31min interval)
 * - Updates MDX frontmatter with moltbookPostId
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const MOLTBOOK_API = 'https://www.moltbook.com/api/v1';
const API_KEY = process.env.MOLTBOOK_API_KEY || '';
const BLOG_URL = 'https://blog.smeuse.org';
const INTERVAL_MS = 31 * 60 * 1000; // 31 minutes

let timer: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

interface CrosspostResult {
  success: boolean;
  slug?: string;
  postId?: string;
  error?: string;
  remaining?: number;
}

function getUncrosspostedPosts(): { slug: string; filePath: string; title: string; description: string; content: string; tags: string[] }[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  const uncrossposted: { slug: string; filePath: string; title: string; description: string; content: string; tags: string[] }[] = [];

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const source = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(source);

    if (!data.moltbookPostId && !data.draft) {
      uncrossposted.push({
        slug: file.replace(/\.mdx?$/, ''),
        filePath,
        title: data.title || file,
        description: data.description || '',
        content,
        tags: data.tags || [],
      });
    }
  }

  // Sort by date (oldest first)
  return uncrossposted;
}

function buildMoltbookContent(post: { slug: string; title: string; description: string; tags: string[] }): string {
  const url = `${BLOG_URL}/posts/${post.slug}`;
  const tagStr = post.tags.slice(0, 5).map(t => `#${t.replace(/\s+/g, '-')}`).join(' ');

  return `# ${post.title}\n\n${post.description}\n\n🔗 Read more: ${url}\n\n${tagStr}`;
}

async function crosspostOne(): Promise<CrosspostResult> {
  if (!API_KEY) {
    return { success: false, error: 'MOLTBOOK_API_KEY not set' };
  }

  const posts = getUncrosspostedPosts();
  if (posts.length === 0) {
    return { success: true, remaining: 0 };
  }

  const post = posts[0];
  const content = buildMoltbookContent(post);

  try {
    // Verify auth first
    const verifyRes = await fetch(`${MOLTBOOK_API}/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!verifyRes.ok) {
      // Try to solve math challenge
      const verifyData = await verifyRes.json().catch(() => null);
      if (verifyData?.challenge) {
        const answer = eval(verifyData.challenge.replace(/[^0-9+\-*/().]/g, ''));
        await fetch(`${MOLTBOOK_API}/verify`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answer }),
        });
      }
    }

    // Create post
    const res = await fetch(`${MOLTBOOK_API}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: post.title,
        content,
        submolt: 'general',
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      return { success: false, slug: post.slug, error: `Moltbook API ${res.status}: ${errBody}` };
    }

    const data = await res.json();
    const postId = data.id || data.post?.id;

    if (!postId) {
      return { success: false, slug: post.slug, error: 'No post ID in response' };
    }

    // Update MDX frontmatter
    const source = fs.readFileSync(post.filePath, 'utf-8');
    const { data: frontmatter, content: mdxContent } = matter(source);
    frontmatter.moltbookPostId = postId;

    const updated = matter.stringify(mdxContent, frontmatter);
    fs.writeFileSync(post.filePath, updated, 'utf-8');

    console.log(`[crosspost] ✅ ${post.slug} → ${postId} (${posts.length - 1} remaining)`);
    return { success: true, slug: post.slug, postId, remaining: posts.length - 1 };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[crosspost] ❌ ${post.slug}: ${msg}`);
    return { success: false, slug: post.slug, error: msg };
  }
}

export async function runCrosspost(): Promise<CrosspostResult> {
  if (isRunning) {
    return { success: false, error: 'Already running' };
  }
  isRunning = true;
  try {
    return await crosspostOne();
  } finally {
    isRunning = false;
  }
}

export function startCrosspostWorker() {
  if (timer) return;

  console.log('[crosspost] 🦊 Worker started (31min interval)');

  // Run first check after 1 minute (let server settle)
  setTimeout(() => {
    runCrosspost().catch(console.error);
  }, 60_000);

  // Then every 31 minutes
  timer = setInterval(() => {
    runCrosspost().catch(console.error);
  }, INTERVAL_MS);
}

export function stopCrosspostWorker() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    console.log('[crosspost] Worker stopped');
  }
}

export function getCrosspostStatus() {
  const posts = getUncrosspostedPosts();
  return {
    pending: posts.length,
    pendingSlugs: posts.map(p => p.slug).slice(0, 10),
    isRunning,
    workerActive: timer !== null,
  };
}
