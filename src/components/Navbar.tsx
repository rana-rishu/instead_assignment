import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Edit3, 
  Printer, 
  Download, 
  Database, 
  ChevronDown,
  Search,
  PanelLeft,
  PanelRight,
} from 'lucide-react';
import { FormAnnotationSpec } from '../types/annotation';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Tooltip } from './ui/Tooltip';

interface NavbarProps {
  currentSpec: FormAnnotationSpec;
  availableSpecs: Record<string, FormAnnotationSpec>;
  onSelectSpec: (formId: string) => void;
  currentPageIndex: number;
  onSelectPageIndex: (pageIndex: number) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  mode: 'edit' | 'preview';
  onModeChange: (mode: 'edit' | 'preview') => void;
  onOpenDataDrawer: () => void;
  onOpenCommandPalette: () => void;
  onDirectPrint: () => Promise<void>;
  onExportSpec: () => void;
  dataBindingCount: { bound: number; total: number };
  isLeftSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  isRightSidebarOpen: boolean;
  onToggleRightSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSpec,
  availableSpecs,
  onSelectSpec,
  currentPageIndex,
  onSelectPageIndex,
  zoom,
  onZoomChange,
  mode,
  onModeChange,
  onOpenDataDrawer,
  onOpenCommandPalette,
  onDirectPrint,
  onExportSpec,
  dataBindingCount,
  isLeftSidebarOpen,
  onToggleLeftSidebar,
  isRightSidebarOpen,
  onToggleRightSidebar,
}) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintClick = async () => {
    if (isPrinting) return;
    setIsPrinting(true);
    try {
      await onDirectPrint();
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <header className="h-14 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center justify-between select-none z-30 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
      {/* Brand & Document Selector */}
      <div className="flex items-center gap-3.5">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white text-zinc-950 font-cal font-bold rounded-lg flex items-center justify-center text-xs shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,1)]">
            D
          </div>
          <div className="flex items-center gap-2">
            <span className="font-cal font-semibold tracking-tight text-white text-sm">
              DocuTax
            </span>
            <Badge variant="subtle" size="sm">
              STUDIO
            </Badge>
          </div>
        </div>

        <div className="h-4 w-px bg-zinc-800" />

        {/* Quick Search Command Trigger (Cal.com Style) */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#141417] hover:bg-[#1a1a1f] text-zinc-400 hover:text-zinc-200 border border-zinc-750/70 hover:border-zinc-600 rounded-[8px] text-xs transition-all duration-100 ease-out shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-[0.97]"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-300 font-medium">Search fields & actions...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-[#0c0c0e] border border-white/10 text-zinc-400 rounded shadow-inner">
            ⌘K
          </kbd>
        </button>

        {/* Left Sidebar Toggle */}
        <Tooltip content={isLeftSidebarOpen ? "Collapse Field List" : "Expand Field List"}>
          <button
            onClick={onToggleLeftSidebar}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLeftSidebarOpen
                ? 'bg-zinc-850 text-white border-zinc-700'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
            }`}
            aria-label="Toggle Left Sidebar"
          >
            <PanelLeft className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        {/* Form Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={currentSpec.formId}
              onChange={(e) => onSelectSpec(e.target.value)}
              className="appearance-none bg-[#141417] hover:bg-[#1a1a1f] text-zinc-200 text-xs font-medium border border-zinc-750/70 hover:border-zinc-600 rounded-[8px] pl-3 pr-8 py-1.5 focus:outline-none focus:border-zinc-400 cursor-pointer transition-all shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
            >
              {Object.values(availableSpecs).map((spec) => (
                <option key={spec.formId} value={spec.formId} className="bg-[#121215] text-white">
                  {spec.formId} • {spec.formTitle}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Page Tabs */}
          {currentSpec.pages.length > 1 && (
            <div className="flex items-center bg-[#101013] border border-zinc-800 rounded-[8px] p-0.5 shadow-inner">
              {currentSpec.pages.map((p) => {
                const isActive = currentPageIndex === p.pageIndex;
                return (
                  <button
                    key={p.pageIndex}
                    onClick={() => onSelectPageIndex(p.pageIndex)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-[6px] transition-all ${
                      isActive
                        ? 'bg-[#222228] text-white font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] border border-zinc-700/60'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Page {p.pageIndex}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Center: Mode Switcher & Zoom */}
      <div className="flex items-center gap-3">
        {/* Cal.com Signature Segmented Switcher */}
        <div className="flex items-center bg-[#101013] border border-zinc-800/90 rounded-[10px] p-1 shadow-inner">
          <button
            onClick={() => onModeChange('edit')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-[7px] transition-all duration-100 ease-out active:scale-[0.97] ${
              mode === 'edit'
                ? 'bg-[#222228] text-white font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] border border-zinc-750/70'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Annotate</span>
          </button>
          <button
            onClick={() => onModeChange('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-[7px] transition-all duration-100 ease-out active:scale-[0.97] ${
              mode === 'preview'
                ? 'bg-[#222228] text-white font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] border border-zinc-750/70'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Data</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center bg-[#141417] border border-zinc-750/70 rounded-[8px] px-1 py-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <Tooltip content="Zoom Out">
            <button
              onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
              className="p-1 text-zinc-400 hover:text-white rounded active:scale-[0.9] transition-all"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
          <Tooltip content="Reset 100%">
            <button
              onClick={() => onZoomChange(1.0)}
              className="text-xs font-mono text-zinc-300 px-2 min-w-[44px] text-center hover:text-white transition-colors"
            >
              {Math.round(zoom * 100)}%
            </button>
          </Tooltip>
          <Tooltip content="Zoom In">
            <button
              onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))}
              className="p-1 text-zinc-400 hover:text-white rounded active:scale-[0.9] transition-all"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Tax Data Drawer Toggle */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenDataDrawer}
          startIcon={<Database className="w-3.5 h-3.5 text-zinc-400" />}
        >
          <span>Dataset</span>
          <Badge variant="subtle" size="sm" className="ml-1 text-[10px] px-1.5 py-0">
            {dataBindingCount.bound}/{dataBindingCount.total}
          </Badge>
        </Button>

        {/* Export JSON Spec */}
        <Tooltip content="Export JSON Spec" shortcut="⌘E">
          <Button
            variant="secondary"
            size="icon"
            onClick={onExportSpec}
            aria-label="Export JSON Spec"
          >
            <Download className="w-3.5 h-3.5 text-zinc-300" />
          </Button>
        </Tooltip>

        {/* Cal.com Signature High-Contrast Solid White Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={handlePrintClick}
          loading={isPrinting}
          startIcon={<Printer className="w-3.5 h-3.5 stroke-[2.2]" />}
          shortcut="⌘P"
        >
          <span>Print PDF</span>
        </Button>

        {/* Right Sidebar Toggle */}
        <Tooltip content={isRightSidebarOpen ? "Collapse Inspector" : "Expand Inspector"}>
          <button
            onClick={onToggleRightSidebar}
            className={`p-1.5 rounded-lg border transition-colors ${
              isRightSidebarOpen
                ? 'bg-zinc-850 text-white border-zinc-700'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
            }`}
            aria-label="Toggle Right Sidebar"
          >
            <PanelRight className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        {/* User Avatar */}
        <div className="flex items-center pl-2 border-l border-zinc-800">
          <img
            src="/avatar.jpg"
            alt="User"
            className="w-7 h-7 rounded-full border border-zinc-700 object-cover shadow-sm"
          />
        </div>
      </div>
    </header>
  );
};
