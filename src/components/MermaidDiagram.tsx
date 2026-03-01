'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  caption?: string;
  title?: string;
}

/**
 * Mermaid diagram renderer using dynamic import.
 *
 * @example
 * ```tsx
 * <MermaidDiagram
 *   chart={`graph TD; A[Start] --> B[Done];`}
 *   caption="Execution flow"
 * />
 * ```
 */
export default function MermaidDiagram({ chart, caption, title }: MermaidDiagramProps) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const renderId = useRef(`mermaid-${Math.random().toString(36).slice(2, 10)}`);
  const resolvedCaption = caption ?? title;

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      if (!chart.trim()) {
        setError('Diagram source is empty.');
        setSvg('');
        return;
      }

      try {
        setError(null);
        const mermaid = (await import('mermaid')).default;
        const isDarkMode =
          document.documentElement.classList.contains('dark') &&
          document.documentElement.dataset.theme !== 'light';

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: isDarkMode ? 'dark' : 'default',
        });

        const { svg: rendered } = await mermaid.render(
          `${renderId.current}-${Date.now()}`,
          chart,
        );

        if (!isMounted) {
          return;
        }

        setSvg(rendered);
      } catch (cause) {
        if (!isMounted) {
          return;
        }

        setSvg('');
        setError(cause instanceof Error ? cause.message : 'Unknown Mermaid rendering error.');
      }
    }

    void renderDiagram();
    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <figure className="not-prose my-8">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
        {error ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-300">
            Mermaid render failed: {error}
          </p>
        ) : svg ? (
          <div
            role="img"
            aria-label={resolvedCaption || 'Mermaid diagram'}
            className="min-w-fit"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <p role="status" className="text-sm text-slate-500 dark:text-slate-400">
            Rendering diagram...
          </p>
        )}
      </div>
      {resolvedCaption ? (
        <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          {resolvedCaption}
        </figcaption>
      ) : null}
    </figure>
  );
}
