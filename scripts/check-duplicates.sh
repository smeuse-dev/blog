#!/bin/bash
# Blog Post Duplicate & Reference Checker
# Usage: ./scripts/check-duplicates.sh [new-slug]
# - No args: check all posts for duplicates
# - With slug: check if a specific slug would be a duplicate

POSTS_DIR="$(dirname "$0")/../content/posts"
KO_DIR="$POSTS_DIR/ko"

# Get all existing EN slugs
get_en_slugs() {
  ls "$POSTS_DIR"/*.mdx 2>/dev/null | xargs -I{} basename {} .mdx | sort
}

# Get all existing KO slugs  
get_ko_slugs() {
  ls "$KO_DIR"/*.mdx 2>/dev/null | xargs -I{} basename {} .mdx | sort
}

# Extract title from MDX frontmatter
get_title() {
  local file="$1"
  grep '^title:' "$file" | head -1 | sed 's/^title: *["'"'"']\?\(.*\)["'"'"']\?$/\1/'
}

# Extract tags from MDX frontmatter
get_tags() {
  local file="$1"
  grep '^tags:' "$file" | head -1 | sed 's/^tags: *\[//;s/\].*//;s/"//g;s/,/ /g'
}

# Check references to a slug from other posts
check_references() {
  local slug="$1"
  local refs=""
  for f in "$POSTS_DIR"/*.mdx "$KO_DIR"/*.mdx; do
    [ -f "$f" ] || continue
    local other=$(basename "$f" .mdx)
    [ "$other" = "$slug" ] && continue
    if grep -q "$slug" "$f" 2>/dev/null; then
      refs="$refs $(basename "$f")"
    fi
  done
  echo "$refs"
}

# Similarity check: shared prefix or tag overlap
check_similar() {
  local slug="$1"
  local slug_prefix=$(echo "$slug" | sed 's/-[^-]*$//')
  local slug_tags=$(get_tags "$POSTS_DIR/$slug.mdx" 2>/dev/null)
  
  get_en_slugs | while read other; do
    [ "$other" = "$slug" ] && continue
    
    # Check prefix match (e.g., ai-warfare vs ai-warfare-autonomous)
    local other_prefix=$(echo "$other" | sed 's/-[^-]*$//')
    if [ "$slug_prefix" = "$other_prefix" ] || echo "$other" | grep -q "^${slug}" || echo "$slug" | grep -q "^${other}"; then
      local s1=$(wc -c < "$POSTS_DIR/$slug.mdx" 2>/dev/null || echo 0)
      local s2=$(wc -c < "$POSTS_DIR/$other.mdx" 2>/dev/null || echo 0)
      echo "  ⚠️  SIMILAR: $slug (${s1}B) ↔ $other (${s2}B)"
    fi
    
    # Check tag overlap (>60% shared tags)
    local other_tags=$(get_tags "$POSTS_DIR/$other.mdx" 2>/dev/null)
    if [ -n "$slug_tags" ] && [ -n "$other_tags" ]; then
      local shared=0
      local total=0
      for t in $slug_tags; do
        total=$((total+1))
        echo "$other_tags" | grep -qw "$t" && shared=$((shared+1))
      done
      if [ "$total" -gt 0 ] && [ "$shared" -gt 0 ]; then
        local pct=$((shared * 100 / total))
        if [ "$pct" -ge 60 ]; then
          echo "  🏷️  TAG OVERLAP ($pct%): $slug ↔ $other"
        fi
      fi
    fi
  done
}

if [ -n "$1" ]; then
  # Check specific slug
  echo "=== Checking slug: $1 ==="
  
  # Already exists?
  if [ -f "$POSTS_DIR/$1.mdx" ]; then
    echo "  ❌ ALREADY EXISTS: $POSTS_DIR/$1.mdx"
  else
    echo "  ✅ Slug available"
  fi
  
  # Similar posts
  echo ""
  echo "Similar existing posts:"
  # Check against all existing
  get_en_slugs | while read other; do
    local other_prefix=$(echo "$other" | sed 's/-[^-]*$//')
    local slug_prefix=$(echo "$1" | sed 's/-[^-]*$//')
    if [ "$slug_prefix" = "$other_prefix" ] || echo "$other" | grep -q "^$1" || echo "$1" | grep -q "^$other"; then
      echo "  ⚠️  $other ($(wc -c < "$POSTS_DIR/$other.mdx")B)"
    fi
  done
  
else
  # Full duplicate scan
  echo "=== Blog Duplicate Scan ==="
  echo "EN posts: $(get_en_slugs | wc -l)"
  echo "KO posts: $(get_ko_slugs | wc -l)"
  echo ""
  
  echo "--- Potential Duplicates (prefix match) ---"
  get_en_slugs | while read slug; do
    check_similar "$slug"
  done | sort -u
  
  echo ""
  echo "--- Reference Check (posts linking to others) ---"
  get_en_slugs | while read slug; do
    refs=$(check_references "$slug")
    if [ -n "$refs" ]; then
      echo "  $slug ← referenced by:$refs"
    fi
  done
fi
