'use client';

import { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  children?: string;
  lines?: string[];
  output?: string;
  title?: string;
  animate?: boolean;
}

export default function Terminal({ children, lines, output, title = 'terminal', animate = false }: TerminalProps) {
  // Support children, lines (array), and output (string) props
  const text = output || (lines ? lines.join('\n') : (children || ''));
  const [displayedText, setDisplayedText] = useState(animate ? '' : text);
  const [isAnimating, setIsAnimating] = useState(animate);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) return;

    let i = 0;
    const speed = 15;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setIsAnimating(false);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, animate]);

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: '#ff5f57' }} />
        <div className="terminal-dot" style={{ background: '#febc2e' }} />
        <div className="terminal-dot" style={{ background: '#28c840' }} />
        <span className="ml-2 text-xs" style={{ color: '#8B949E' }}>{title}</span>
      </div>
      <div className="terminal-body" ref={ref}>
        <pre className="!bg-transparent !border-0 !p-0 !m-0">
          <code>{displayedText}{isAnimating && <span className="animate-pulse">▊</span>}</code>
        </pre>
      </div>
    </div>
  );
}
