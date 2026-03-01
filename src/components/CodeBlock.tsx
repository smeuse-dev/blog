'use client';

import { useMemo, useState } from 'react';

interface CodeBlockProps {
  className?: string;
  title?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  children: string;
}

async function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === 'undefined') {
    throw new Error('Clipboard is not available.');
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error('Copy command failed.');
  }
}

/**
 * MDX code block with language badge, line highlighting, and copy button.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   className="language-ts"
 *   title="app.ts"
 *   showLineNumbers
 *   highlightLines={[2, 4]}
 * >
 * {`const total = values.reduce((a, b) => a + b, 0);`}
 * </CodeBlock>
 * ```
 */
export default function CodeBlock({
  className,
  title,
  showLineNumbers = false,
  highlightLines = [],
  children,
}: CodeBlockProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  const language = useMemo(() => {
    const match = className?.match(/language-([\w-]+)/i);
    return match?.[1]?.toLowerCase() || 'text';
  }, [className]);

  const normalized = useMemo(() => {
    const text = typeof children === 'string' ? children : String(children ?? '');
    return text.replace(/\n$/, '');
  }, [children]);

  const lines = useMemo(() => normalized.split('\n'), [normalized]);
  const highlighted = useMemo(() => new Set(highlightLines), [highlightLines]);

  const handleCopy = async () => {
    try {
      await copyText(normalized);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    } finally {
      window.setTimeout(() => setCopyState('idle'), 1500);
    }
  };

  const copyLabel =
    copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy';

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 text-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between gap-3 border-b border-slate-700/80 bg-slate-800 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          {title ? <span className="truncate text-xs text-slate-200">{title}</span> : null}
          <span className="rounded-full border border-slate-600 bg-slate-900 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
            {language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border border-slate-600 px-2.5 py-1 text-xs text-slate-200 transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          aria-label="Copy code to clipboard"
        >
          {copyLabel}
        </button>
      </div>

      <pre className="!m-0 !max-h-[32rem] overflow-auto !rounded-none !border-0 !bg-transparent !p-0">
        <code className="block py-3 text-sm leading-6">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlighted.has(lineNumber);

            return (
              <span
                key={`${lineNumber}-${line}`}
                className={`${
                  showLineNumbers ? 'grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3' : 'block'
                } px-4 ${isHighlighted ? 'bg-orange-500/15' : ''}`}
              >
                {showLineNumbers ? (
                  <span aria-hidden="true" className="select-none text-right text-xs text-slate-500">
                    {lineNumber}
                  </span>
                ) : null}
                <span className="whitespace-pre">{line || ' '}</span>
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}
