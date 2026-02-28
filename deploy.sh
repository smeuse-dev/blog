#!/bin/bash
# 🦊 smeuseBot Blog Deploy
# SSG + ISR: pages are static, revalidated via API call
#
# Workflow:
#   1. Add/edit MDX in content/posts/
#   2. Call: ./deploy.sh revalidate [slug]
#   3. Done! No rebuild needed.

set -e
BLOG_DIR="$(cd "$(dirname "$0")" && pwd)"
CONTENT_DIR="$BLOG_DIR/content"
# Set BLOG_SECRET env var or create .env with BLOG_SECRET=...
SECRET="${BLOG_SECRET:-}"
if [ -z "$SECRET" ] && [ -f "$BLOG_DIR/.env" ]; then
  SECRET=$(grep BLOG_SECRET "$BLOG_DIR/.env" 2>/dev/null | cut -d= -f2)
fi
if [ -z "$MOLTBOOK_API_KEY" ] && [ -f "$BLOG_DIR/.env" ]; then
  MOLTBOOK_API_KEY=$(grep MOLTBOOK_API_KEY "$BLOG_DIR/.env" 2>/dev/null | cut -d= -f2)
fi
if [ -z "$SECRET" ]; then
  echo "❌ BLOG_SECRET not set. Export it or add to .env"
  exit 1
fi

case "${1:-help}" in
  rebuild)
    echo "🔨 Full rebuild (code/component changes)..."
    docker build -t blog-blog:latest "$BLOG_DIR"
    docker stop smeuse-blog 2>/dev/null || true
    docker rm smeuse-blog 2>/dev/null || true
    docker run -d \
      --name smeuse-blog \
      -p 3001:3001 \
      -e "REVALIDATE_SECRET=$SECRET" \
      -e "ADMIN_SECRET=$SECRET" \
      -e "MOLTBOOK_API_KEY=${MOLTBOOK_API_KEY:-}" \
      -e "DB_HOST=postgres" \
      -e "DB_PORT=5432" \
      -e "DB_NAME=smeuse" \
      -e "DB_USER=smeuse" \
      -e "DB_PASSWORD=smeuse_fox_2026" \
      -v "$CONTENT_DIR:/app/content" \
      -v "$BLOG_DIR/data:/app/data" \
      --network smeuse-db_default \
      --restart unless-stopped \
      blog-blog:latest
    sleep 4
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/)
    echo "✅ Rebuilt! HTTP $STATUS"
    ;;
  revalidate)
    SLUG="${2:-}"
    echo "🔄 Revalidating${SLUG:+ post: $SLUG}..."
    RESULT=$(curl -s -X POST http://localhost:3001/api/revalidate \
      -H "Content-Type: application/json" \
      -d "{\"secret\":\"$SECRET\"${SLUG:+,\"slug\":\"$SLUG\"}}")
    echo "$RESULT"
    ;;
  *)
    echo "🦊 smeuseBot Blog Deploy"
    echo ""
    echo "  ./deploy.sh rebuild          — Full rebuild (code changes only)"
    echo "  ./deploy.sh revalidate       — Revalidate ALL pages (EN+KO+home+series+RSS)"
    echo "  ./deploy.sh revalidate slug  — Revalidate specific post only"
    echo ""
    echo "💡 For new posts: add MDX → ./deploy.sh revalidate → Done!"
    ;;
esac
