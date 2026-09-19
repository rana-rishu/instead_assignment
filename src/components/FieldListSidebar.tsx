import React, { useState, useMemo } from 'react';
import { FormAnnotationSpec, FormFieldCategory } from '../types/annotation';
import { resolveDataPath, applyTransform } from '../engine/jsonPathResolver';
import { Search, Plus, X } from 'lucide-react';
import { Button } from './ui/Button';

interface FieldListSidebarProps {
  spec: FormAnnotationSpec;
  currentPageIndex: number;
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onAddNewField: () => void;
  dataset: any;
}

const CATEGORIES: FormFieldCategory[] = [
  'IDENTITY',
  'FILING_STATUS',
  'INCOME',
  'ADJUSTMENTS',
  'DEDUCTIONS',
  'TAX_AND_CREDITS',
  'PAYMENTS',
  'REFUND',
  'PREPARER',
  'OTHER',
];

export const FieldListSidebar: React.FC<FieldListSidebarProps> = ({
  spec,
  currentPageIndex,
  selectedFieldId,
  onSelectField,
  onAddNewField,
  dataset,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const pageFields = useMemo(() => {
    return spec.fields.filter((f) => f.pageIndex === currentPageIndex && !f.hidden);
  }, [spec.fields, currentPageIndex]);

  const filteredFields = useMemo(() => {
    return pageFields.filter((f) => {
      const matchesSearch =
        searchQuery === '' ||
        f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.boxNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.dataBinding?.path && f.dataBinding.path.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'ALL' || f.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [pageFields, searchQuery, selectedCategory]);

  return (
    <aside className="w-76 bg-[#09090b]/80 backdrop-blur-md border-r border-zinc-800/80 flex flex-col h-full overflow-hidden select-none z-10 text-xs">
      {/* Header toolbar */}
      <div className="p-3.5 border-b border-zinc-800/80 space-y-2.5 bg-[#09090b]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-cal font-semibold text-zinc-100 text-sm">
            <span>Fields</span>
            <span className="text-zinc-500 font-sans text-xs font-normal">({pageFields.length})</span>
          </div>

          <Button
            variant="primary"
            size="xs"
            onClick={onAddNewField}
            startIcon={<Plus className="w-3.5 h-3.5 stroke-[2.2]" />}
          >
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fields or paths..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-md pl-8 pr-7 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category selector pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            ALL
          </button>
          {CATEGORIES.map((cat) => {
            const count = pageFields.filter((f) => f.category === cat).length;
            if (count === 0 && selectedCategory !== cat) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Field List Items */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        {filteredFields.length === 0 ? (
          <div className="p-6 text-center text-zinc-500 font-sans text-xs">
            No fields found.
          </div>
        ) : (
          filteredFields.map((field) => {
            const isSelected = selectedFieldId === field.id;
            const rawVal = field.dataBinding?.path ? resolveDataPath(dataset, field.dataBinding.path) : undefined;
            const formattedVal = applyTransform(rawVal, field.dataBinding?.transform || 'NONE', field);
            const hasBinding = !!field.dataBinding?.path;

            return (
              <button
                key={field.id}
                onClick={() => onSelectField(field.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex flex-col gap-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] ${
                  isSelected
                    ? 'bg-zinc-800/90 border-zinc-500 text-white shadow-sm'
                    : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 overflow-hidden min-w-0">
                    <span
                      className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-semibold shrink-0 ${
                        isSelected
                          ? 'bg-white text-black'
                          : 'bg-zinc-950 text-zinc-300 border border-zinc-800'
                      }`}
                    >
                      {field.boxNumber}
                    </span>
                    <span className="font-medium truncate text-xs text-white">
                      {field.label}
                    </span>
                  </div>

                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      hasBinding ? 'bg-emerald-400' : 'bg-zinc-600'
                    }`}
                    title={hasBinding ? 'Bound' : 'Static'}
                  />
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 mt-0.5">
                  <span className="truncate max-w-[130px] text-zinc-500">
                    {field.dataBinding?.path || 'static'}
                  </span>
                  <span className="text-zinc-200 font-medium truncate max-w-[90px]">
                    {formattedVal || '—'}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};
