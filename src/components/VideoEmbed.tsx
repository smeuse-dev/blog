interface VideoEmbedProps {
  src: string;
  title?: string;
  aspectRatio?: string;
}

function toEmbedUrl(src: string): string | null {
  try {
    const url = new URL(src);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname.startsWith('/embed/')) {
        return `https://www.youtube.com${url.pathname}`;
      }

      if (url.pathname === '/watch') {
        const id = url.searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (url.pathname.startsWith('/shorts/')) {
        const id = url.pathname.split('/')[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }

    if (host === 'youtu.be') {
      const id = url.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === 'vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    if (host === 'player.vimeo.com' && url.pathname.startsWith('/video/')) {
      return `https://player.vimeo.com${url.pathname}`;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Responsive YouTube/Vimeo embed with aspect ratio control.
 *
 * @example
 * ```tsx
 * <VideoEmbed
 *   src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 *   title="Demo Video"
 * />
 * ```
 */
export default function VideoEmbed({ src, title, aspectRatio = '16 / 9' }: VideoEmbedProps) {
  const embedSrc = toEmbedUrl(src);
  const iframeTitle = title || 'Embedded video';

  if (!embedSrc) {
    return (
      <div
        role="alert"
        className="not-prose my-6 rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-200"
      >
        Unsupported video URL. Use a YouTube or Vimeo link.
      </div>
    );
  }

  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="relative w-full" style={{ aspectRatio }}>
          <iframe
            src={embedSrc}
            title={iframeTitle}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
      {title ? <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{title}</figcaption> : null}
    </figure>
  );
}
