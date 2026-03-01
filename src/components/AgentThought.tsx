'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';

interface AgentThoughtProps {
  label?: string;
  icon?: ReactNode;
  collapsed?: boolean;
  children: ReactNode;
}

/**
 * Collapsible callout for AI agent reasoning notes.
 *
 * @example
 * ```tsx
 * <AgentThought label="Reasoning Note" collapsed>
 *   We compare three strategies and choose the lowest-risk option.
 * </AgentThought>
 * ```
 */
export default function AgentThought({
  label = 'Agent Thought',
  icon = '🧠',
  collapsed = false,
  children,
}: AgentThoughtProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const contentId = useId();

  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  return (
    <aside className="agent-thought not-prose my-6 rounded-xl border border-orange-300/40 bg-orange-50/70 p-4 dark:border-orange-500/30 dark:bg-slate-900/70">
      <button
        type="button"
        className="agent-thought-header flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-orange-700 transition hover:text-orange-800 dark:text-orange-300 dark:hover:text-orange-200"
        aria-expanded={!isCollapsed}
        aria-controls={contentId}
        onClick={() => setIsCollapsed(previous => !previous)}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span aria-hidden="true" className="shrink-0">
            {icon}
          </span>
          <span className="truncate">{label}</span>
        </span>
        <span
          aria-hidden="true"
          className={`inline-flex h-6 w-6 items-center justify-center rounded-md border border-orange-300/60 text-xs dark:border-orange-400/40 ${isCollapsed ? '' : 'rotate-180'} transition-transform`}
        >
          ▼
        </span>
      </button>

      <div
        id={contentId}
        hidden={isCollapsed}
        className="mt-3 border-t border-orange-300/40 pt-3 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:text-slate-200"
      >
        {children}
      </div>
    </aside>
  );
}
