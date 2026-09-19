import React, { useState } from 'react';
import { Database, RefreshCw, X, AlertTriangle, CheckCircle2, Copy, Sparkles } from 'lucide-react';
import { SAMPLE_TAXPAYER_DATA } from '../mockData';

interface NestedDataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: any;
  onUpdateDataset: (newData: any) => void;
}

export const NestedDataDrawer: React.FC<NestedDataDrawerProps> = ({
  isOpen,
  onClose,
  dataset,
  onUpdateDataset,
}) => {
  const [rawText, setRawText] = useState<string>(() => JSON.stringify(dataset, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRawChange = (text: string) => {
    setRawText(text);
    try {
      const parsed = JSON.parse(text);
      setParseError(null);
      onUpdateDataset(parsed);
    } catch (e: any) {
      setParseError(e.message);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(rawText);
      const formatted = JSON.stringify(parsed, null, 2);
      setRawText(formatted);
      setParseError(null);
      onUpdateDataset(parsed);
    } catch (e: any) {
      setParseError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleResetSample = () => {
    onUpdateDataset(SAMPLE_TAXPAYER_DATA);
    setRawText(JSON.stringify(SAMPLE_TAXPAYER_DATA, null, 2));
    setParseError(null);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 h-80 bg-[#121215] border-t border-[#222227] shadow-panel z-40 flex flex-col select-none text-xs">
      {/* Header */}
      <div className="h-10 border-b border-[#222227] px-4 flex items-center justify-between bg-[#121215]">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-coffee" />
          <span className="font-mono font-semibold text-zinc-200">
            TAXPAYER_RETURN.JSON
          </span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
              parseError
                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}
          >
            {parseError ? 'INVALID JSON' : 'SYNCED'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleFormat}
            className="flex items-center gap-1 bg-[#18181c] hover:bg-[#202026] text-zinc-300 hover:text-white border border-[#27272a] px-2.5 py-1 rounded text-xs transition-colors"
          >
            <Sparkles className="w-3 h-3 text-coffee" />
            <span>Format</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 bg-[#18181c] hover:bg-[#202026] text-zinc-300 hover:text-white border border-[#27272a] px-2.5 py-1 rounded text-xs transition-colors"
          >
            <Copy className="w-3 h-3" />
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleResetSample}
            className="flex items-center gap-1 bg-[#18181c] hover:bg-[#202026] text-zinc-300 hover:text-white border border-[#27272a] px-2.5 py-1 rounded text-xs transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <div className="h-4 w-px bg-[#222227] mx-1" />

          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white hover:bg-[#18181c] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-hidden p-2 flex flex-col bg-[#0c0c0e]">
        {parseError && (
          <div className="mb-1.5 p-2 bg-rose-950/60 border border-rose-800 rounded text-rose-400 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}
        <textarea
          value={rawText}
          onChange={(e) => handleRawChange(e.target.value)}
          spellCheck={false}
          className="flex-1 w-full bg-[#121215] border border-[#222227] focus:border-coffee rounded p-3 text-xs font-mono text-zinc-200 focus:outline-none resize-none leading-relaxed selection:bg-coffee/30"
        />
      </div>
    </div>
  );
};
