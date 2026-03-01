import type { ReactNode } from 'react';

interface TLDRProps {
  title?: string;
  children: ReactNode;
}

/**
 * Summary callout for key takeaways.
 *
 * @example
 * ```tsx
 * <TLDR title="Quick Summary">
 *   AI adoption is accelerating, but governance is lagging.
 * </TLDR>
 * ```
 */
export default function TLDR({ title = 'TL;DR', children }: TLDRProps) {
  return (
    <aside
      role="note"
      aria-label={title}
      className="not-prose my-6 rounded-xl border border-emerald-300/50 bg-emerald-50/70 p-4 dark:border-emerald-500/30 dark:bg-emerald-950/30"
    >
      <p className="m-0 text-sm font-semibold tracking-wide text-emerald-700 dark:text-emerald-300">{title}</p>
      <div className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{children}</div>
    </aside>
  );
}
