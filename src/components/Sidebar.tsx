import TableOfContents from '@/components/TableOfContents';
import PopularPosts from '@/components/PopularPosts';

export default function Sidebar() {
  return (
    <>
      {/* Desktop: Fixed sidebar with ToC + Popular */}
      <aside
        className="hidden xl:block fixed top-24 right-[max(1rem,calc((100vw-56rem)/2-16rem))] w-56 max-h-[calc(100vh-8rem)] overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--border-color) transparent',
        }}
      >
        <TableOfContents />
        <PopularPosts />
      </aside>

      {/* Mobile: Inline ToC only (PopularPosts stays at bottom) */}
      <div className="xl:hidden">
        <TableOfContents />
      </div>
    </>
  );
}
