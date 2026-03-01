'use client';

interface PDFDownloadProps {
  title: string;
}

/**
 * Print/PDF download button using browser print dialog.
 */
export default function PDFDownload({ title }: PDFDownloadProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:opacity-80"
      style={{ background: 'var(--bg-dark-tertiary)', color: 'var(--text-secondary)' }}
      aria-label={`Download ${title} as PDF`}
      title="Print / Save as PDF"
    >
      📄 PDF
    </button>
  );
}
