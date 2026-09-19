import React, { useState, useRef, useMemo } from 'react';
import { FormAnnotationSpec, FormFieldAnnotation } from '../types/annotation';
import { SVG_TEMPLATES } from '../mockData/svgTemplates';
import { applyTransform, resolveDataPath } from '../engine/jsonPathResolver';
import { calculateCombCells } from '../engine/combFormatter';

interface CanvasAnnotatorProps {
  spec: FormAnnotationSpec;
  currentPageIndex: number;
  zoom: number;
  mode: 'edit' | 'preview';
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
  onUpdateFieldBounds: (fieldId: string, bounds: { x: number; y: number; width: number; height: number }) => void;
  dataset: any;
}

type DragMode = 'none' | 'move' | 'resize-nw' | 'resize-n' | 'resize-ne' | 'resize-e' | 'resize-se' | 'resize-s' | 'resize-sw' | 'resize-w';

export const CanvasAnnotator: React.FC<CanvasAnnotatorProps> = ({
  spec,
  currentPageIndex,
  zoom,
  mode,
  selectedFieldId,
  onSelectField,
  onUpdateFieldBounds,
  dataset,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragMode, setDragMode] = useState<DragMode>('none');
  const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; box: { x: number; y: number; width: number; height: number } } | null>(null);
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentPage = useMemo(() => {
    return spec.pages.find((p) => p.pageIndex === currentPageIndex) || spec.pages[0];
  }, [spec.pages, currentPageIndex]);

  const pageFields = useMemo(() => {
    return spec.fields.filter((f) => f.pageIndex === currentPageIndex && !f.hidden);
  }, [spec.fields, currentPageIndex]);

  const selectedField = useMemo(() => {
    return spec.fields.find((f) => f.id === selectedFieldId);
  }, [spec.fields, selectedFieldId]);

  const svgKey = `${spec.formId}-${currentPageIndex}`;
  const svgTemplate = SVG_TEMPLATES[svgKey] || SVG_TEMPLATES[`${spec.formId}-1`] || '';

  const getCanvasCoords = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / zoom;
    const rawY = (e.clientY - rect.top) / zoom;
    return {
      x: Math.max(0, Math.min(currentPage.width, rawX)),
      y: Math.max(0, Math.min(currentPage.height, rawY)),
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);
    setCursorPos({ x: Math.round(coords.x), y: Math.round(coords.y) });

    if (dragMode === 'none' || !dragStart || !selectedField) return;

    const deltaX = coords.x - dragStart.mouseX;
    const deltaY = coords.y - dragStart.mouseY;

    if (dragMode === 'move') {
      const newX = Math.round(Math.max(0, Math.min(currentPage.width - dragStart.box.width, dragStart.box.x + deltaX)));
      const newY = Math.round(Math.max(0, Math.min(currentPage.height - dragStart.box.height, dragStart.box.y + deltaY)));
      onUpdateFieldBounds(selectedField.id, {
        x: newX,
        y: newY,
        width: dragStart.box.width,
        height: dragStart.box.height,
      });
    } else if (dragMode.startsWith('resize-')) {
      let { x, y, width, height } = dragStart.box;

      if (dragMode.includes('e')) width = Math.max(10, dragStart.box.width + deltaX);
      if (dragMode.includes('s')) height = Math.max(8, dragStart.box.height + deltaY);
      if (dragMode.includes('w')) {
        const potentialW = dragStart.box.width - deltaX;
        if (potentialW >= 10) {
          x = dragStart.box.x + deltaX;
          width = potentialW;
        }
      }
      if (dragMode.includes('n')) {
        const potentialH = dragStart.box.height - deltaY;
        if (potentialH >= 8) {
          y = dragStart.box.y + deltaY;
          height = potentialH;
        }
      }

      onUpdateFieldBounds(selectedField.id, {
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(width),
        height: Math.round(height),
      });
    }
  };

  const handleMouseUp = () => {
    setDragMode('none');
    setDragStart(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
      onSelectField(null);
    }
  };

  const startResize = (e: React.MouseEvent, handle: DragMode) => {
    e.stopPropagation();
    if (!selectedField) return;
    const coords = getCanvasCoords(e);
    setDragMode(handle);
    setDragStart({
      mouseX: coords.x,
      mouseY: coords.y,
      box: { ...selectedField.bounds },
    });
  };

  const startMove = (e: React.MouseEvent, field: FormFieldAnnotation) => {
    e.stopPropagation();
    onSelectField(field.id);
    if (mode === 'preview') return;
    const coords = getCanvasCoords(e);
    setDragMode('move');
    setDragStart({
      mouseX: coords.x,
      mouseY: coords.y,
      box: { ...field.bounds },
    });
  };

  return (
    <div
      className="flex-1 bg-studio-workspace relative overflow-auto select-none p-4 md:p-8"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Precision Coordinates HUD */}
      <div className="fixed md:absolute bottom-4 left-6 z-20 bg-[#121215]/95 backdrop-blur border border-[#27272a] px-3 py-1.5 rounded text-[11px] font-mono text-zinc-400 flex items-center gap-3 shadow-panel">
        <span>X: <strong className="text-zinc-200">{cursorPos.x}</strong></span>
        <span>Y: <strong className="text-zinc-200">{cursorPos.y}</strong> pt</span>
        <span className="text-zinc-600">|</span>
        <span>{currentPage.width} × {currentPage.height} pt</span>
        <span className="text-zinc-600">|</span>
        <span className="text-coffee-text">{pageFields.length} boxes</span>
      </div>

      {/* Form Canvas Sheet Wrapper */}
      <div className="min-w-fit min-h-fit flex items-center justify-center p-4">
        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          style={{
            width: currentPage.width * zoom,
            height: currentPage.height * zoom,
            minWidth: currentPage.width * zoom,
            minHeight: currentPage.height * zoom,
          }}
          className="relative bg-white shadow-sheet rounded-[1px] transition-all duration-75 overflow-hidden cursor-default ring-1 ring-zinc-800 m-auto"
        >
        {/* Layer 1: Vector IRS SVG Template */}
        <div
          className="absolute inset-0 pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
          style={{ width: '100%', height: '100%' }}
          dangerouslySetInnerHTML={{ __html: svgTemplate }}
        />

        {/* Layer 2: Annotation Bounding Boxes & Live Values */}
        {pageFields.map((field) => {
          const isSelected = selectedFieldId === field.id;
          const isHovered = hoveredFieldId === field.id;
          const rawVal = field.dataBinding?.path ? resolveDataPath(dataset, field.dataBinding.path) : undefined;
          const formattedVal = applyTransform(rawVal, field.dataBinding?.transform || 'NONE', field);

          const left = field.bounds.x * zoom;
          const top = field.bounds.y * zoom;
          const width = field.bounds.width * zoom;
          const height = field.bounds.height * zoom;

          return (
            <div
              key={field.id}
              onMouseDown={(e) => startMove(e, field)}
              onMouseEnter={() => setHoveredFieldId(field.id)}
              onMouseLeave={() => setHoveredFieldId(null)}
              style={{
                left,
                top,
                width,
                height,
                zIndex: isSelected ? 30 : isHovered ? 20 : 10,
              }}
              className={`absolute group transition-none ${
                mode === 'preview'
                  ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-coffee'
                  : isSelected
                  ? 'outline outline-1.5 outline-coffee bg-coffee/[0.08] cursor-move'
                  : isHovered
                  ? 'outline outline-1 outline-coffee/80 bg-coffee/[0.04] cursor-pointer'
                  : 'outline outline-1 outline-zinc-400/40 hover:outline-coffee/60 cursor-pointer'
              }`}
            >
              {/* Field Label Badge (Edit Mode) */}
              {mode !== 'preview' && (
                <div
                  className={`absolute -top-4 left-0 px-1.5 py-0.2 rounded-[2px] text-[9px] font-mono font-bold truncate max-w-[140px] pointer-events-none ${
                    isSelected
                      ? 'bg-coffee text-zinc-950 opacity-100'
                      : isHovered
                      ? 'bg-[#18181c] text-coffee border border-[#27272a] opacity-100'
                      : 'bg-[#18181c]/90 text-zinc-300 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {field.boxNumber}
                </div>
              )}

              {/* Rendered Content */}
              <div className="w-full h-full relative overflow-hidden flex items-center">
                {field.fieldType === 'COMB_TEXT' && field.combConfig ? (
                  // Comb Box Segmented Layout
                  <div className="w-full h-full flex items-center relative">
                    {calculateCombCells(formattedVal || '', field.bounds, field.combConfig).map((cell, idx) => (
                      <div
                        key={idx}
                        style={{
                          left: (cell.x - field.bounds.x) * zoom,
                          width: cell.width * zoom,
                          height: cell.height * zoom,
                        }}
                        className={`absolute flex items-center justify-center font-mono font-bold text-black ${
                          mode !== 'preview' && !cell.isDelimiter
                            ? 'border-b border-r border-zinc-300'
                            : ''
                        }`}
                      >
                        <span style={{ fontSize: (field.formatting?.fontSize || 10) * zoom }}>
                          {cell.char}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : field.fieldType === 'CHECKBOX' || field.fieldType === 'RADIO_GROUP' ? (
                  // Checkbox Marker
                  <div className="w-full h-full flex items-center justify-center font-bold text-black">
                    <span
                      style={{
                        fontSize: (field.checkboxConfig?.markerSize || 10) * zoom,
                        fontFamily: 'Helvetica, Arial, sans-serif',
                      }}
                    >
                      {formattedVal}
                    </span>
                  </div>
                ) : (
                  // Standard Text / Currency
                  <div
                    className={`w-full px-0.5 truncate text-black ${
                      field.formatting?.align === 'right' || field.fieldType === 'CURRENCY'
                        ? 'text-right'
                        : field.formatting?.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    } ${field.formatting?.fontWeight === 'bold' ? 'font-bold' : 'font-normal'}`}
                    style={{
                      fontFamily: field.formatting?.fontFamily || 'Courier, monospace',
                      fontSize: (field.formatting?.fontSize || 9.5) * zoom,
                      color: field.formatting?.color || '#000000',
                    }}
                  >
                    {formattedVal}
                  </div>
                )}
              </div>

              {/* Resize Handles for Selected Box */}
              {isSelected && mode === 'edit' && (
                <>
                  <div onMouseDown={(e) => startResize(e, 'resize-nw')} className="absolute -top-1 -left-1 w-2 h-2 bg-coffee border border-black cursor-nwse-resize z-40" />
                  <div onMouseDown={(e) => startResize(e, 'resize-n')} className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-coffee border border-black cursor-ns-resize z-40" />
                  <div onMouseDown={(e) => startResize(e, 'resize-ne')} className="absolute -top-1 -right-1 w-2 h-2 bg-coffee border border-black cursor-nesw-resize z-40" />
                  <div onMouseDown={(e) => startResize(e, 'resize-e')} className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-coffee border border-black cursor-ew-resize z-40" />
                  <div onMouseDown={(e) => startResize(e, 'resize-se')} className="absolute -bottom-1 -right-1 w-2 h-2 bg-coffee border border-black cursor-nwse-resize z-40" />
                  <div onMouseDown={(e) => startResize(e, 'resize-s')} className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-coffee border border-black cursor-ns-resize z-40" />
                  <div onMouseDown={(e) => startResize(e, 'resize-sw')} className="absolute -bottom-1 -left-1 w-2 h-2 bg-coffee border border-black cursor-nesw-resize z-40" />
                  <div onMouseDown={(e) => startResize(e, 'resize-w')} className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-coffee border border-black cursor-ew-resize z-40" />
                </>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};
