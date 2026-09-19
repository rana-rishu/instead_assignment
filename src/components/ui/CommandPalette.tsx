import React, { useState, useEffect, useMemo } from 'react';
import { Search, Printer, FileDown, Eye, Edit3, X, CornerDownLeft } from 'lucide-react';
import { FormFieldAnnotation } from '../../types/annotation';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FormFieldAnnotation[];
  onSelectField: (id: string) => void;
  onPrintPdf: () => void;
  onExportSpec: () => void;
  isLiveDataMode: boolean;
  onToggleLiveData: () => void;
}

interface PaletteAction {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  icon: React.ReactNode;
  shortcut?: string;
  run: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  fields,
  onSelectField,
  onPrintPdf,
  onExportSpec,
  isLiveDataMode,
  onToggleLiveData,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Actions list
  const actions: PaletteAction[] = useMemo(() => {
    const staticActions: PaletteAction[] = [
      {
        id: 'action-print',
        title: 'Print PDF (1-Click Direct)',
        category: 'Actions',
        icon: <Printer className="w-4 h-4 text-white" />,
        shortcut: '⌘P',
        run: () => {
          onPrintPdf();
          onClose();
        },
      },
      {
        id: 'action-toggle-mode',
        title: isLiveDataMode ? 'Switch to Annotation Mode' : 'Switch to Live Data Preview',
        category: 'Modes',
        icon: isLiveDataMode ? <Edit3 className="w-4 h-4 text-coffee" /> : <Eye className="w-4 h-4 text-emerald-400" />,
        shortcut: 'Tab',
        run: () => {
          onToggleLiveData();
          onClose();
        },
      },
      {
        id: 'action-export-json',
        title: 'Export Annotation Specification JSON',
        category: 'Export',
        icon: <FileDown className="w-4 h-4 text-zinc-300" />,
        shortcut: '⌘E',
        run: () => {
          onExportSpec();
          onClose();
        },
      },
    ];

    const fieldActions: PaletteAction[] = fields.map((f) => ({
      id: `field-${f.id}`,
      title: `${f.boxNumber ? `[${f.boxNumber}] ` : ''}${f.label}`,
      subtitle: `${f.dataBinding?.path || 'Static field'} • ${f.fieldType}`,
      category: 'Form Fields',
      icon: <span className="w-4 h-4 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono flex items-center justify-center text-zinc-300">#</span>,
      shortcut: f.boxNumber || '',
      run: () => {
        onSelectField(f.id);
        onClose();
      },
    }));

    const q = query.toLowerCase().trim();
    if (!q) return [...staticActions, ...fieldActions];

    return [...staticActions, ...fieldActions].filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, isLiveDataMode, fields, onPrintPdf, onToggleLiveData, onExportSpec, onSelectField, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(actions.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + actions.length) % Math.max(actions.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (actions[selectedIndex]) {
        actions[selectedIndex].run();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Command Box */}
      <div className="relative w-full max-w-xl z-10 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800/80 gap-3 bg-zinc-900/50">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search form fields..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-900">
          {actions.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No matching commands or fields found.
            </div>
          ) : (
            actions.map((action, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={action.id}
                  onClick={action.run}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-zinc-850 text-white'
                      : 'text-zinc-300 hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">{action.icon}</span>
                    <div className="min-w-0 truncate">
                      <div className="text-xs font-medium text-zinc-100 truncate">
                        {action.title}
                      </div>
                      {action.subtitle && (
                        <div className="text-[11px] text-zinc-500 truncate font-mono">
                          {action.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                      {action.category}
                    </span>
                    {action.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {action.shortcut}
                      </kbd>
                    )}
                    {isSelected && <CornerDownLeft className="w-3 h-3 text-zinc-400" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-900 bg-zinc-950/80 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <div className="flex items-center gap-1">
            <span>DocuTax</span>
            <span>•</span>
            <span>Cal.com UI Suite</span>
          </div>
        </div>
      </div>
    </div>
  );
};
