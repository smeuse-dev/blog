import type { ReactNode } from 'react';

interface FootnoteProps {
  id: string | number;
  children: ReactNode;
}

/**
 * Block-style footnote item for MDX articles.
 *
 * @example
 * ```tsx
 * <Footnote id={1}>
 *   Figures are based on public filings from 2025.
 * </Footnote>
 * ```
 */
export default function Footnote({ id, children }: FootnoteProps) {
  const marker = String(id);

  return (
    <aside
      id={`footnote-${marker}`}
      role="note"
      aria-label={`Footnote ${marker}`}
      className="not-prose my-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
    >
      <p className="m-0 leading-6 text-slate-700 dark:text-slate-300">
        <span className="mr-2 inline-flex rounded-md border border-slate-300 bg-white px-1.5 py-0.5 text-xs font-semibold text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
          [{marker}]
        </span>
        {children}
      </p>
    </aside>
  );
}
