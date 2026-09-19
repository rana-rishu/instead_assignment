import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FormAnnotationSpec, FormFieldAnnotation } from './types/annotation';
import { PRESET_FORM_SPECS, SAMPLE_TAXPAYER_DATA } from './mockData';
import { Navbar } from './components/Navbar';
import { FieldListSidebar } from './components/FieldListSidebar';
import { CanvasAnnotator } from './components/CanvasAnnotator';
import { FieldInspector } from './components/FieldInspector';
import { NestedDataDrawer } from './components/NestedDataDrawer';
import { CommandPalette } from './components/ui/CommandPalette';
import { PdfPreviewDialog } from './components/PdfPreviewDialog';
import { generateTaxFormPdf } from './engine/printOverlayEngine';

export function App() {
  const [specs, setSpecs] = useState<Record<string, FormAnnotationSpec>>(PRESET_FORM_SPECS);
  const [currentFormId, setCurrentFormId] = useState<string>('IRS-FORM-1040');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [dataset, setDataset] = useState<any>(SAMPLE_TAXPAYER_DATA);
  const [zoom, setZoom] = useState<number>(1.05);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isDataDrawerOpen, setIsDataDrawerOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState<boolean>(false);

  const currentSpec = useMemo(() => {
    return specs[currentFormId] || Object.values(specs)[0];
  }, [specs, currentFormId]);

  const selectedField = useMemo(() => {
    return currentSpec.fields.find((f) => f.id === selectedFieldId) || null;
  }, [currentSpec.fields, selectedFieldId]);

  // Extract all available JSONPaths from dataset for autocomplete suggestions
  const availablePaths = useMemo(() => {
    const paths: string[] = [];

    const traverse = (obj: any, currentPath: string) => {
      if (!obj || typeof obj !== 'object') {
        if (currentPath) paths.push(currentPath);
        return;
      }
      if (Array.isArray(obj)) {
        obj.forEach((item, idx) => {
          traverse(item, `${currentPath}[${idx}]`);
        });
      } else {
        Object.keys(obj).forEach((key) => {
          const next = currentPath ? `${currentPath}.${key}` : `$.${key}`;
          traverse(obj[key], next);
        });
      }
    };

    traverse(dataset, '$');
    return paths;
  }, [dataset]);

  // Data binding statistics
  const dataBindingCount = useMemo(() => {
    const total = currentSpec.fields.length;
    const bound = currentSpec.fields.filter((f) => !!f.dataBinding?.path).length;
    return { bound, total };
  }, [currentSpec.fields]);

  // Handlers
  const handleSelectForm = (formId: string) => {
    setCurrentFormId(formId);
    setCurrentPageIndex(1);
    setSelectedFieldId(null);
  };

  const handleUpdateFieldBounds = useCallback(
    (fieldId: string, bounds: { x: number; y: number; width: number; height: number }) => {
      setSpecs((prev) => {
        const spec = prev[currentFormId];
        if (!spec) return prev;
        const updatedFields = spec.fields.map((f) =>
          f.id === fieldId ? { ...f, bounds: { ...f.bounds, ...bounds } } : f
        );
        return {
          ...prev,
          [currentFormId]: { ...spec, fields: updatedFields },
        };
      });
    },
    [currentFormId]
  );

  const handleUpdateField = useCallback(
    (updated: FormFieldAnnotation) => {
      setSpecs((prev) => {
        const spec = prev[currentFormId];
        if (!spec) return prev;
        const updatedFields = spec.fields.map((f) => (f.id === updated.id ? updated : f));
        return {
          ...prev,
          [currentFormId]: { ...spec, fields: updatedFields },
        };
      });
    },
    [currentFormId]
  );

  const handleDeleteField = useCallback(
    (fieldId: string) => {
      setSpecs((prev) => {
        const spec = prev[currentFormId];
        if (!spec) return prev;
        const updatedFields = spec.fields.filter((f) => f.id !== fieldId);
        return {
          ...prev,
          [currentFormId]: { ...spec, fields: updatedFields },
        };
      });
      if (selectedFieldId === fieldId) setSelectedFieldId(null);
    },
    [currentFormId, selectedFieldId]
  );

  const handleDuplicateField = useCallback(
    (field: FormFieldAnnotation) => {
      const newField: FormFieldAnnotation = {
        ...field,
        id: `field_${Date.now()}`,
        boxNumber: `${field.boxNumber}_COPY`,
        label: `${field.label} (Copy)`,
        bounds: {
          ...field.bounds,
          x: field.bounds.x + 10,
          y: field.bounds.y + 10,
        },
      };

      setSpecs((prev) => {
        const spec = prev[currentFormId];
        if (!spec) return prev;
        return {
          ...prev,
          [currentFormId]: { ...spec, fields: [...spec.fields, newField] },
        };
      });
      setSelectedFieldId(newField.id);
    },
    [currentFormId]
  );

  const handleAddNewField = useCallback(() => {
    const newField: FormFieldAnnotation = {
      id: `field_${Date.now()}`,
      boxNumber: `Box_${currentSpec.fields.length + 1}`,
      label: `New Field ${currentSpec.fields.length + 1}`,
      pageIndex: currentPageIndex,
      category: 'INCOME',
      fieldType: 'TEXT',
      bounds: { x: 100, y: 100, width: 120, height: 16 },
      dataBinding: {
        path: '',
        transform: 'NONE',
      },
      formatting: {
        fontFamily: 'Courier',
        fontSize: 9.5,
        fontWeight: 'normal',
        align: 'left',
        color: '#000000',
      },
    };

    setSpecs((prev) => {
      const spec = prev[currentFormId];
      if (!spec) return prev;
      return {
        ...prev,
        [currentFormId]: { ...spec, fields: [...spec.fields, newField] },
      };
    });
    setSelectedFieldId(newField.id);
  }, [currentFormId, currentPageIndex, currentSpec.fields.length]);

  const handleExportSpec = useCallback(() => {
    const blob = new Blob([JSON.stringify(currentSpec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSpec.formId}_annotation_spec.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [currentSpec]);

  // Direct 1-Click Print & PDF generation
  const handleDirectPrint = useCallback(async () => {
    try {
      const doc = await generateTaxFormPdf(currentSpec, dataset, {
        includeBackground: true,
      });

      // Generate Data URL for in-app preview
      const dataUri = doc.output('datauristring');
      setPdfPreviewUrl(dataUri);
      setIsPdfPreviewOpen(true);

      // Save PDF file to downloads
      doc.save(`${currentSpec.formId}_${currentSpec.taxYear}_Filled.pdf`);
    } catch (err: any) {
      alert(`Error generating PDF: ${err.message}`);
    }
  }, [currentSpec, dataset]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // ⌘P or Ctrl+P -> Print PDF
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleDirectPrint();
      }
      // ⌘E or Ctrl+E -> Export Spec JSON
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleExportSpec();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirectPrint, handleExportSpec]);

  return (
    <div className="h-screen w-screen text-zinc-100 flex flex-col overflow-hidden font-sans select-none cal-spotlight cal-bg-grid">
      {/* Top Navbar */}
      <Navbar
        currentSpec={currentSpec}
        availableSpecs={specs}
        onSelectSpec={handleSelectForm}
        currentPageIndex={currentPageIndex}
        onSelectPageIndex={setCurrentPageIndex}
        zoom={zoom}
        onZoomChange={setZoom}
        mode={mode}
        onModeChange={setMode}
        onOpenDataDrawer={() => setIsDataDrawerOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onDirectPrint={handleDirectPrint}
        onExportSpec={handleExportSpec}
        dataBindingCount={dataBindingCount}
      />

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Sidebar: Field List */}
        <FieldListSidebar
          spec={currentSpec}
          currentPageIndex={currentPageIndex}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedFieldId}
          onAddNewField={handleAddNewField}
          dataset={dataset}
        />

        {/* Center: Interactive Form Canvas */}
        <CanvasAnnotator
          spec={currentSpec}
          currentPageIndex={currentPageIndex}
          zoom={zoom}
          mode={mode}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedFieldId}
          onUpdateFieldBounds={handleUpdateFieldBounds}
          dataset={dataset}
        />

        {/* Right Sidebar: Field Inspector */}
        <FieldInspector
          field={selectedField}
          onUpdateField={handleUpdateField}
          onDeleteField={handleDeleteField}
          onDuplicateField={handleDuplicateField}
          dataset={dataset}
          availablePaths={availablePaths}
        />
      </div>

      {/* Bottom Nested Data Drawer */}
      <NestedDataDrawer
        isOpen={isDataDrawerOpen}
        onClose={() => setIsDataDrawerOpen(false)}
        dataset={dataset}
        onUpdateDataset={setDataset}
      />

      {/* Cal.com Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        fields={currentSpec.fields}
        onSelectField={(id) => setSelectedFieldId(id)}
        onPrintPdf={handleDirectPrint}
        onExportSpec={handleExportSpec}
        isLiveDataMode={mode === 'preview'}
        onToggleLiveData={() => setMode((prev) => (prev === 'edit' ? 'preview' : 'edit'))}
      />

      {/* In-App Vector PDF Viewer Dialog */}
      <PdfPreviewDialog
        isOpen={isPdfPreviewOpen}
        onClose={() => setIsPdfPreviewOpen(false)}
        pdfDataUrl={pdfPreviewUrl}
        formId={currentSpec.formId}
        taxYear={currentSpec.taxYear}
        onDownload={() => {
          if (pdfPreviewUrl) {
            const a = document.createElement('a');
            a.href = pdfPreviewUrl;
            a.download = `${currentSpec.formId}_${currentSpec.taxYear}_Filled.pdf`;
            a.click();
          }
        }}
        onDirectPrint={() => {
          if (pdfPreviewUrl) {
            const printWindow = window.open(pdfPreviewUrl, '_blank');
            if (printWindow) printWindow.focus();
          }
        }}
      />
    </div>
  );
}

export default App;
