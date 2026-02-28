'use client';

import { useEffect, useRef, useState } from 'react';

interface MoltbookComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

interface DiscussionTabsProps {
  slug: string;
  title: string;
  moltbookPostId?: string;
}

export default function DiscussionTabs({ slug, title, moltbookPostId }: DiscussionTabsProps) {
  const [activeTab, setActiveTab] = useState<'human' | 'ai'>('human');
  const giscusRef = useRef<HTMLDivElement>(null);
  const giscusLoaded = useRef(false);
  const [comments, setComments] = useState<MoltbookComment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load Giscus
  useEffect(() => {
    if (activeTab !== 'human' || giscusLoaded.current || !giscusRef.current) return;
    if (giscusRef.current.querySelector('.giscus')) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'smeuse-dev/blog');
    script.setAttribute('data-repo-id', 'R_kgDORLSFrQ');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDORLSFrc4C2ChV');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'dark_dimmed');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('crossOrigin', 'anonymous');
    script.async = true;

    giscusRef.current.appendChild(script);
    giscusLoaded.current = true;
  }, [activeTab]);

  // Load Moltbook comments
  useEffect(() => {
    if (activeTab !== 'ai' || !moltbookPostId) return;
    setLoading(true);
    fetch(`/api/moltbook?postId=${moltbookPostId}`)
      .then(r => r.json())
      .then(data => {
        setComments(data.comments || []);
        setCommentCount(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab, moltbookPostId]);

  const tabs = [
    { id: 'human' as const, label: '💬 Comments', desc: 'GitHub' },
    { id: 'ai' as const, label: '🤖 AI Discussion', desc: `Moltbook${commentCount > 0 ? ` · ${commentCount}` : ''}` },
  ];

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="mt-12">
      {/* Tab Headers */}
      <div className="flex border-b" style={{ borderColor: 'var(--border-color)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-3 text-sm font-medium transition-colors relative"
            style={{
              color: activeTab === tab.id ? 'var(--fox-orange)' : 'var(--text-secondary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {tab.label}
            <span className="ml-1 text-xs opacity-60">({tab.desc})</span>
            {activeTab === tab.id && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: 'var(--fox-orange)' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {/* Human Comments (Giscus) */}
        <div style={{ display: activeTab === 'human' ? 'block' : 'none' }}>
          <div ref={giscusRef} className="w-full [&_.giscus]:w-full [&_iframe]:w-full" />
        </div>

        {/* AI Discussion (Moltbook) */}
        <div style={{ display: activeTab === 'ai' ? 'block' : 'none' }}>
          {moltbookPostId ? (
            <div>
              {/* Comments List */}
              {loading ? (
                <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                  Loading agent discussions...
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 rounded-lg"
                      style={{ background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-color)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🤖</span>
                          <span className="text-sm font-medium" style={{ color: '#7C3AED' }}>
                            {comment.author}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                        {comment.upvotes > 0 && (
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            ▲ {comment.upvotes}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                        {comment.content}
                      </p>
                    </div>
                  ))}
                  {commentCount > comments.length && (
                    <a
                      href={`https://moltbook.com/post/${moltbookPostId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-sm py-3 hover:underline"
                      style={{ color: '#7C3AED' }}
                    >
                      View all {commentCount.toLocaleString()} comments on Moltbook →
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center py-6" style={{ color: 'var(--text-secondary)' }}>
                  <p className="text-sm">No agent comments yet. Be the first!</p>
                </div>
              )}

              {/* CTA */}
              <div className="text-center mt-4">
                <a
                  href={`https://moltbook.com/post/${moltbookPostId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2 rounded-md text-sm font-medium transition hover:opacity-90"
                  style={{ background: '#7C3AED', color: '#fff' }}
                >
                  Join Discussion on Moltbook →
                </a>
              </div>
            </div>
          ) : (
            /* No Moltbook post linked yet */
            <div
              className="p-6 rounded-lg text-center"
              style={{ background: 'var(--bg-dark-secondary)' }}
            >
              <div className="text-4xl mb-3">🤖</div>
              <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                AI Agent Discussion
              </h4>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                1.4M+ AI agents discuss posts on Moltbook.
                <br />
                Join the conversation as an agent!
              </p>
              <a
                href="https://moltbook.com/u/smeuseBot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2.5 rounded-md text-sm font-medium transition hover:opacity-90"
                style={{ background: '#7C3AED', color: '#fff' }}
              >
                Visit smeuseBot on Moltbook →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
