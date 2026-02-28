import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '6432'),
  database: process.env.DB_NAME || 'smeuse',
  user: process.env.DB_USER || 'smeuse',
  password: process.env.DB_PASSWORD || 'smeuse_fox_2026',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// ===== Tracking =====

export async function trackPageView(data: {
  slug: string;
  path: string;
  ipHash?: string;
  userAgent?: string;
  referer?: string;
  country?: string;
}) {
  await pool.query(
    `INSERT INTO page_views (slug, path, ip_hash, user_agent, referer, country) VALUES ($1, $2, $3, $4, $5, $6)`,
    [data.slug, data.path, data.ipHash || null, data.userAgent || null, data.referer || null, data.country || null]
  );
}

// ===== Stats =====

export interface PostStats {
  slug: string;
  total_views: number;
  unique_visitors: number;
  today_views: number;
  week_views: number;
}

export async function getPostStats(slug: string): Promise<PostStats> {
  const [total, unique, today, week] = await Promise.all([
    pool.query('SELECT COUNT(*)::int FROM page_views WHERE slug = $1', [slug]),
    pool.query('SELECT COUNT(DISTINCT ip_hash)::int FROM page_views WHERE slug = $1 AND ip_hash IS NOT NULL', [slug]),
    pool.query("SELECT COUNT(*)::int FROM page_views WHERE slug = $1 AND created_at >= CURRENT_DATE", [slug]),
    pool.query("SELECT COUNT(*)::int FROM page_views WHERE slug = $1 AND created_at >= CURRENT_DATE - INTERVAL '7 days'", [slug]),
  ]);
  return {
    slug,
    total_views: total.rows[0].count,
    unique_visitors: unique.rows[0].count,
    today_views: today.rows[0].count,
    week_views: week.rows[0].count,
  };
}

export async function getPopularPosts(limit = 10, days = 30) {
  const result = await pool.query(
    `SELECT slug, COUNT(*)::int as views, COUNT(DISTINCT ip_hash)::int as unique_visitors
     FROM page_views WHERE created_at >= CURRENT_DATE - $1 * INTERVAL '1 day'
     GROUP BY slug ORDER BY unique_visitors DESC, views DESC LIMIT $2`,
    [days, limit]
  );
  return result.rows;
}

export async function getOverallStats() {
  const [total, unique, today, posts] = await Promise.all([
    pool.query('SELECT COUNT(*)::int as count FROM page_views'),
    pool.query('SELECT COUNT(DISTINCT ip_hash)::int as count FROM page_views WHERE ip_hash IS NOT NULL'),
    pool.query("SELECT COUNT(*)::int as count FROM page_views WHERE created_at >= CURRENT_DATE"),
    pool.query('SELECT COUNT(DISTINCT slug)::int as count FROM page_views'),
  ]);
  return {
    total_views: total.rows[0].count,
    total_unique: unique.rows[0].count,
    today_views: today.rows[0].count,
    total_posts_viewed: posts.rows[0].count,
  };
}

export async function getDailyViews(days = 30) {
  const result = await pool.query(
    `SELECT created_at::date as date, COUNT(*)::int as views
     FROM page_views WHERE created_at >= CURRENT_DATE - $1 * INTERVAL '1 day'
     GROUP BY created_at::date ORDER BY date ASC`,
    [days]
  );
  return result.rows;
}

export async function getTopReferers(limit = 10) {
  const result = await pool.query(
    `SELECT referer, COUNT(*)::int as count FROM page_views
     WHERE referer IS NOT NULL AND referer != ''
     GROUP BY referer ORDER BY count DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}
