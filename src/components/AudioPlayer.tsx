'use client';

interface AudioPlayerProps {
  src: string;
  title?: string;
  caption?: string;
}

/**
 * Accessible HTML audio player for MDX.
 *
 * @example
 * ```tsx
 * <AudioPlayer
 *   src="/audio/episode-01.mp3"
 *   title="Episode 01"
 *   caption="Recorded in Seoul"
 * />
 * ```
 */
export default function AudioPlayer({ src, title, caption }: AudioPlayerProps) {
  return (
    <figure className="not-prose my-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
      {title ? <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</p> : null}
      <audio controls preload="metadata" className="w-full" aria-label={title || 'Audio player'}>
        <source src={src} />
        Your browser does not support the audio element.
      </audio>
      <div className="mt-2 flex items-center justify-between gap-3">
        {caption ? <figcaption className="text-sm text-slate-500 dark:text-slate-400">{caption}</figcaption> : <span />}
        <a
          href={src}
          className="text-xs text-blue-600 underline-offset-2 hover:underline dark:text-blue-300"
        >
          Download audio
        </a>
      </div>
    </figure>
  );
}
