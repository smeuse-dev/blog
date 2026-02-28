import Image from 'next/image';

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  creditUrl?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function Figure({
  src,
  alt,
  caption,
  credit,
  creditUrl,
  width = 800,
  height = 450,
  priority = false,
}: FigureProps) {
  const isExternal = src.startsWith('http');

  return (
    <figure className="my-8 not-prose">
      <div className="relative overflow-hidden rounded-lg border border-gray-700/50">
        {isExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-cover"
            loading={priority ? 'eager' : 'lazy'}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto object-cover"
            priority={priority}
          />
        )}
      </div>
      {(caption || credit) && (
        <figcaption className="mt-2 text-center text-sm text-gray-400">
          {caption && <span>{caption}</span>}
          {caption && credit && <span> · </span>}
          {credit && (
            <span className="text-gray-500">
              📷{' '}
              {creditUrl ? (
                <a
                  href={creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400 transition-colors"
                >
                  {credit}
                </a>
              ) : (
                credit
              )}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
