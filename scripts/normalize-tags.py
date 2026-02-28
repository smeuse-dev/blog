#!/usr/bin/env python3
"""Normalize frontmatter tags and inject category for all blog posts.

Usage:
  python3 normalize-tags.py            # apply changes
  python3 normalize-tags.py --dry-run   # print changes only
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Dict, List, Sequence, Tuple

import yaml


BLOG_ROOT = Path('/mnt/d/develop/source/blog')
TAG_MAPPING_PATH = BLOG_ROOT / 'scripts' / 'tag-mapping.json'
CATEGORY_MAPPING_PATH = BLOG_ROOT / 'scripts' / 'category-mapping.json'

POST_DIRS = [
    BLOG_ROOT / 'content' / 'posts',
    BLOG_ROOT / 'content' / 'posts' / 'ko',
]


def load_json(path: Path) -> dict:
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)


def to_kebab(tag: str) -> str:
    text = (tag or '').strip().lower()
    text = text.replace('_', '-')
    text = text.replace(',', '-')
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'[^0-9a-z가-힣-]+', '-', text)
    text = re.sub(r'-{2,}', '-', text)
    return text.strip('-')


def normalize_tag(tag: str, mapping: Dict[str, str]) -> str:
    tag = str(tag)
    if tag in mapping:
        return mapping[tag]
    return to_kebab(tag)


def normalize_tags(tags: Sequence[object], mapping: Dict[str, str]) -> List[str]:
    out: List[str] = []
    seen = set()
    for raw in tags:
        normalized = normalize_tag(str(raw), mapping).strip()
        if not normalized:
            continue
        if normalized in seen:
            continue
        out.append(normalized)
        seen.add(normalized)
    return out


def parse_frontmatter(text: str) -> Tuple[List[str], str] | None:
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n?', text, flags=re.S)
    if not m:
        return None
    fm_lines = m.group(1).split('\n')
    suffix = text[m.end():]
    return fm_lines, suffix


def find_key_block(lines: List[str], key: str) -> Tuple[int, int] | None:
    key_re = re.compile(rf'^(?P<indent>[ \t]*){re.escape(key)}\s*:\s*(?P<rest>.*)$')
    for i, line in enumerate(lines):
        m = key_re.match(line)
        if not m:
            continue

        if m.group('rest').strip():
            return i, i + 1

        j = i + 1
        while j < len(lines) and re.match(r'^\s*-\s+.*$', lines[j]):
            j += 1
        return i, j

    return None


def has_key(lines: List[str], key: str) -> bool:
    return any(re.match(rf'^[ \t]*{re.escape(key)}\s*:', line) for line in lines)


def build_new_frontmatter(lines: List[str], tags: List[str], category: str | None) -> List[str]:
    lines = lines.copy()

    tags_block = find_key_block(lines, 'tags')
    if tags_block is None:
        raise ValueError('frontmatter has no tags field')
    s, e = tags_block
    new_tags_line = f'tags: [{", ".join(json.dumps(t, ensure_ascii=False) for t in tags)}]'
    lines = lines[:s] + [new_tags_line] + lines[e:]

    if category and not has_key(lines, 'category'):
        insert_at = s + 1
        lines = lines[:insert_at] + [f'category: "{category}"'] + lines[insert_at:]

    return lines


def determine_category(tags: List[str], category_map: Dict[str, List[str]]) -> str | None:
    tag_set = set(tags)
    for category, tag_list in category_map.items():
        for ctag in tag_list:
            if ctag in tag_set:
                return category
    return None


def process_file(path: Path, tag_map: Dict[str, str], category_map: Dict[str, List[str]]) -> dict:
    text = path.read_text(encoding='utf-8')
    parsed = parse_frontmatter(text)
    if not parsed:
        return {'changed': False}

    fm_lines, suffix = parsed
    try:
        frontmatter = yaml.safe_load('\n'.join(fm_lines)) or {}
    except yaml.YAMLError:
        return {'changed': False, 'error': 'yaml_parse'}

    raw_tags = frontmatter.get('tags', [])
    if not isinstance(raw_tags, list):
        raw_tags = []

    new_tags = normalize_tags(raw_tags, tag_map)
    old_tags = [str(x) for x in raw_tags]

    assigned_category = None
    category_changed = False
    if not frontmatter.get('category'):
        assigned_category = determine_category(new_tags, category_map)
        category_changed = assigned_category is not None

    tags_changed = old_tags != new_tags
    changed = tags_changed or category_changed

    if not changed:
        return {'changed': False}

    new_fm_lines = build_new_frontmatter(
        fm_lines,
        new_tags,
        assigned_category if category_changed else None,
    )
    new_text = f"---\n{chr(10).join(new_fm_lines)}\n---\n{suffix}"

    return {
        'changed': True,
        'path': str(path),
        'old_tags': old_tags,
        'new_tags': new_tags,
        'category_added': assigned_category if category_changed else None,
        'new_text': new_text,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description='Normalize frontmatter tags and fill category field.')
    parser.add_argument('--dry-run', action='store_true', help='Print changes only; do not write files.')
    args = parser.parse_args()

    tag_map = load_json(TAG_MAPPING_PATH)
    category_map = load_json(CATEGORY_MAPPING_PATH)

    changed_files = 0
    normalized_tags = 0
    category_assigned = 0

    for post_dir in POST_DIRS:
        for path in sorted(post_dir.glob('*.mdx')):
            result = process_file(path, tag_map, category_map)
            if not result.get('changed'):
                continue

            changed_files += 1
            old_tags = result['old_tags']
            new_tags = result['new_tags']
            category = result['category_added']

            if old_tags != new_tags:
                normalized_tags += len(new_tags)
            if category:
                category_assigned += 1

            if args.dry_run:
                print(f"{result['path']}")
                if old_tags != new_tags:
                    print(f"  tags: {old_tags} -> {new_tags}")
                if category:
                    print(f"  category: {category}")
            else:
                Path(result['path']).write_text(result['new_text'], encoding='utf-8')

    print('--- normalize-tags summary ---')
    print(f'changed_files={changed_files}')
    print(f'normalized_tags={normalized_tags}')
    print(f'category_assigned={category_assigned}')


if __name__ == '__main__':
    main()
