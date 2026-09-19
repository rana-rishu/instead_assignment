import React, { useEffect } from 'react';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { Download, Printer, ExternalLink, X } from 'lucide-react';

interface PdfPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pdfDataUrl: string | null;
  formId: string;
  taxYear: number;
  onDownload: () => void;
  onDirectPrint: () => void;
}

export const PdfPreviewDialog: React.FC<PdfPreviewDialogProps> = ({
  isOpen,
  onClose,
  pdfDataUrl,
  formId,
  taxYear,
  onDownload,
  onDirectPrint,
}) => {
  if (!isOpen || !pdfDataUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl z-10 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-coffee" />
            <div>
              <h2 className="font-cal text-sm font-semibold text-white tracking-tight">
                {formId} • Tax Year {taxYear} Generated PDF
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Vector 72 pt/in • Pixel-Perfect Print Preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onDownload}
              startIcon={<Download className="w-3.5 h-3.5 text-zinc-300" />}
            >
              <span>Download PDF</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onDirectPrint}
              startIcon={<Printer className="w-3.5 h-3.5 stroke-[2.2]" />}
            >
              <span>Print</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors ml-2"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 bg-[#2a2a2e] p-2 overflow-hidden flex items-center justify-center">
          <iframe
            src={pdfDataUrl}
            title="Generated PDF Preview"
            className="w-full h-full rounded border border-zinc-800 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
