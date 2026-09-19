import React from 'react';
import { 
  FormFieldAnnotation, 
  FormFieldCategory, 
  FormFieldType, 
  TransformPipeline, 
  TextAlignment,
} from '../types/annotation';
import { evaluateField } from '../engine/jsonPathResolver';
import { 
  Trash2, 
  Copy, 
  Sliders, 
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

interface FieldInspectorProps {
  field: FormFieldAnnotation | null;
  onUpdateField: (updated: FormFieldAnnotation) => void;
  onDeleteField: (fieldId: string) => void;
  onDuplicateField: (field: FormFieldAnnotation) => void;
  dataset: any;
  availablePaths: string[];
}

export const FieldInspector: React.FC<FieldInspectorProps> = ({
  field,
  onUpdateField,
  onDeleteField,
  onDuplicateField,
  dataset,
  availablePaths,
}) => {
  if (!field) {
    return (
      <aside className="w-80 bg-[#09090b]/80 backdrop-blur-md border-l border-zinc-800/80 p-6 flex flex-col items-center justify-center text-center select-none text-zinc-400 z-10 text-xs">
        <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-3 shadow-inner">
          <Sliders className="w-4 h-4 text-zinc-500" />
        </div>
        <div className="font-cal font-semibold text-zinc-200 text-sm mb-1">Field Properties</div>
        <p className="text-[11px] text-zinc-500 max-w-[200px] leading-relaxed">
          Select an annotation on canvas or the sidebar to configure its position and IRS bindings.
        </p>
      </aside>
    );
  }

  const evaluation = evaluateField(field, dataset);

  const update = (patch: Partial<FormFieldAnnotation>) => {
    onUpdateField({ ...field, ...patch });
  };

  const updateBounds = (patch: Partial<FormFieldAnnotation['bounds']>) => {
    onUpdateField({
      ...field,
      bounds: { ...field.bounds, ...patch },
    });
  };

  const updateDataBinding = (patch: Partial<NonNullable<FormFieldAnnotation['dataBinding']>>) => {
    onUpdateField({
      ...field,
      dataBinding: {
        path: field.dataBinding?.path || '',
        ...field.dataBinding,
        ...patch,
      },
    });
  };

  const updateFormatting = (patch: Partial<NonNullable<FormFieldAnnotation['formatting']>>) => {
    onUpdateField({
      ...field,
      formatting: { ...field.formatting, ...patch },
    });
  };

  const updateCombConfig = (patch: Partial<NonNullable<FormFieldAnnotation['combConfig']>>) => {
    onUpdateField({
      ...field,
      combConfig: {
        cellCount: field.combConfig?.cellCount || 9,
        cellWidth: field.combConfig?.cellWidth || 10,
        ...field.combConfig,
        ...patch,
      },
    });
  };

  return (
    <aside className="w-84 bg-[#09090b]/80 backdrop-blur-md border-l border-zinc-800/80 flex flex-col h-full overflow-hidden select-none z-10 text-xs">
      {/* Header */}
      <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between bg-[#09090b]/50">
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          <span className="px-2 py-0.5 rounded-md bg-white text-black font-mono text-[10px] font-bold shrink-0 shadow-sm">
            {field.boxNumber}
          </span>
          <span className="font-cal font-semibold text-white truncate text-sm">
            {field.label}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => onDuplicateField(field)}
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="destructive"
            size="icon-sm"
            onClick={() => onDeleteField(field.id)}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Properties Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-zinc-300 font-sans">
        {/* Bento Card: Live Evaluation */}
        <Card className="p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-medium">Resolved Preview</span>
            <Badge variant={evaluation.isValid ? 'success' : 'subtle'} size="sm" dot>
              {evaluation.isValid ? 'Bound' : 'Unbound'}
            </Badge>
          </div>

          <div className="font-mono text-sm font-semibold text-white bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 break-all shadow-inner">
            {evaluation.formattedValue || <span className="text-zinc-600 font-normal italic text-xs">Empty / Unassigned</span>}
          </div>

          {evaluation.rawValue !== undefined && (
            <div className="text-[10px] font-mono text-zinc-500 truncate">
              Raw: <span className="text-zinc-300">{JSON.stringify(evaluation.rawValue)}</span>
            </div>
          )}
        </Card>

        {/* Bento Card: Identity */}
        <Card className="p-3 space-y-2.5">
          <div className="font-cal font-semibold text-xs text-white">
            Field Identity
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-zinc-400 mb-1 block font-medium">Box Number</span>
              <input
                type="text"
                value={field.boxNumber}
                onChange={(e) => update({ boxNumber: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none transition-colors"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 mb-1 block font-medium">Category</span>
              <select
                value={field.category}
                onChange={(e) => update({ category: e.target.value as FormFieldCategory })}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2 py-1.5 text-white text-xs focus:outline-none cursor-pointer transition-colors"
              >
                <option value="IDENTITY">IDENTITY</option>
                <option value="FILING_STATUS">FILING_STATUS</option>
                <option value="INCOME">INCOME</option>
                <option value="ADJUSTMENTS">ADJUSTMENTS</option>
                <option value="DEDUCTIONS">DEDUCTIONS</option>
                <option value="TAX_AND_CREDITS">TAX_AND_CREDITS</option>
                <option value="PAYMENTS">PAYMENTS</option>
                <option value="REFUND">REFUND</option>
                <option value="SIGNATURE">SIGNATURE</option>
                <option value="PREPARER">PREPARER</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-zinc-400 mb-1 block font-medium">Label</span>
            <input
              type="text"
              value={field.label}
              onChange={(e) => update({ label: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2.5 py-1.5 text-white text-xs focus:outline-none transition-colors"
            />
          </div>

          <div>
            <span className="text-[10px] text-zinc-400 mb-1 block font-medium">Field Type</span>
            <select
              value={field.fieldType}
              onChange={(e) => update({ fieldType: e.target.value as FormFieldType })}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2.5 py-1.5 text-white text-xs font-semibold focus:outline-none cursor-pointer transition-colors"
            >
              <option value="TEXT">TEXT (Standard Bounded Text)</option>
              <option value="CURRENCY">CURRENCY (Right-Aligned)</option>
              <option value="COMB_TEXT">COMB_TEXT (Segmented Boxes: SSN/EIN)</option>
              <option value="CHECKBOX">CHECKBOX (Single Checkmark / X)</option>
              <option value="RADIO_GROUP">RADIO_GROUP (Choice Group Marker)</option>
              <option value="DATE">DATE (Date)</option>
              <option value="PHONE">PHONE (Phone number)</option>
            </select>
          </div>
        </Card>

        {/* Bento Card: Geometry */}
        <Card className="p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-cal font-semibold text-xs text-white">Bounds (Points)</span>
            <Badge variant="subtle" size="sm">
              72 pt/in
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <div>
              <span className="text-[10px] text-zinc-400 mb-1 block font-mono">X</span>
              <input
                type="number"
                step="0.5"
                value={field.bounds.x}
                onChange={(e) => updateBounds({ x: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2 py-1 text-white font-mono text-xs focus:outline-none"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 mb-1 block font-mono">Y</span>
              <input
                type="number"
                step="0.5"
                value={field.bounds.y}
                onChange={(e) => updateBounds({ y: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2 py-1 text-white font-mono text-xs focus:outline-none"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 mb-1 block font-mono">Width</span>
              <input
                type="number"
                step="0.5"
                value={field.bounds.width}
                onChange={(e) => updateBounds({ width: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2 py-1 text-white font-mono text-xs focus:outline-none"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 mb-1 block font-mono">Height</span>
              <input
                type="number"
                step="0.5"
                value={field.bounds.height}
                onChange={(e) => updateBounds({ height: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2 py-1 text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Bento Card: Data Binding */}
        <Card className="p-3 space-y-2.5">
          <div className="font-cal font-semibold text-xs text-white">
            Data Binding
          </div>

          <div>
            <span className="text-[10px] text-zinc-400 mb-1 block font-medium">JSONPath</span>
            <input
              type="text"
              placeholder="$.taxpayer.personalInfo.firstName"
              value={field.dataBinding?.path || ''}
              onChange={(e) => updateDataBinding({ path: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2.5 py-1.5 text-zinc-100 font-mono text-xs focus:outline-none transition-colors"
            />
          </div>

          <div>
            <span className="text-[10px] text-zinc-400 mb-1 block font-medium">Choose from Return</span>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) updateDataBinding({ path: e.target.value });
              }}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2.5 py-1.5 text-zinc-300 font-mono text-xs focus:outline-none cursor-pointer transition-colors"
            >
              <option value="">-- Choose Data Path --</option>
              {availablePaths.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[10px] text-zinc-400 mb-1 block font-medium">Transform Pipeline</span>
            <select
              value={field.dataBinding?.transform || 'NONE'}
              onChange={(e) => updateDataBinding({ transform: e.target.value as TransformPipeline })}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2.5 py-1.5 text-white text-xs font-mono focus:outline-none cursor-pointer transition-colors"
            >
              <option value="NONE">NONE (Raw string)</option>
              <option value="UPPERCASE">UPPERCASE (ALL CAPS)</option>
              <option value="LOWERCASE">LOWERCASE</option>
              <option value="TITLE_CASE">TITLE_CASE</option>
              <option value="SSN_HYPHENATED">SSN_HYPHENATED (XXX-XX-XXXX)</option>
              <option value="SSN_UNMASKED_DIGITS">SSN_UNMASKED_DIGITS (9 digits for comb)</option>
              <option value="SSN_MASKED_FIRST_FIVE">SSN_MASKED_FIRST_FIVE (***-**-1234)</option>
              <option value="EIN_HYPHENATED">EIN_HYPHENATED (XX-XXXXXXX)</option>
              <option value="CURRENCY_NO_CENTS">CURRENCY_NO_CENTS ($12,450)</option>
              <option value="CURRENCY_WITH_CENTS">CURRENCY_WITH_CENTS ($12,450.00)</option>
              <option value="BOOLEAN_TO_X">BOOLEAN_TO_X (X mark)</option>
              <option value="BOOLEAN_TO_CHECK">BOOLEAN_TO_CHECK (✓ mark)</option>
              <option value="PHONE_US">PHONE_US ((555) 123-4567)</option>
            </select>
          </div>
        </Card>

        {/* Comb Box Config Section */}
        {(field.fieldType === 'COMB_TEXT' || field.fieldType === 'SSN' || field.fieldType === 'EIN') && (
          <Card className="p-3 space-y-2.5">
            <div className="font-cal font-semibold text-xs text-white">
              Comb Box Segmentation
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <div>
                <span className="text-[10px] text-zinc-400 mb-1 block font-mono">Cells</span>
                <input
                  type="number"
                  value={field.combConfig?.cellCount || 9}
                  onChange={(e) => updateCombConfig({ cellCount: parseInt(e.target.value, 10) || 1 })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2 py-1 text-white font-mono text-xs focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 mb-1 block font-mono">Width</span>
                <input
                  type="number"
                  step="0.5"
                  value={field.combConfig?.cellWidth || 9.5}
                  onChange={(e) => updateCombConfig({ cellWidth: parseFloat(e.target.value) || 1 })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2 py-1 text-white font-mono text-xs focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 mb-1 block font-mono">Gap</span>
                <input
                  type="number"
                  step="0.1"
                  value={field.combConfig?.cellGap || 1.2}
                  onChange={(e) => updateCombConfig({ cellGap: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2 py-1 text-white font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400 mb-1 block font-mono">Group Partition (e.g. 3, 2, 4)</span>
              <input
                type="text"
                placeholder="3, 2, 4"
                value={field.combConfig?.groups?.join(', ') || ''}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
                  updateCombConfig({ groups: arr.length > 0 ? arr : undefined });
                }}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </Card>
        )}

        {/* Typography Section */}
        <Card className="p-3 space-y-2.5">
          <div className="font-cal font-semibold text-xs text-white">
            Typography &amp; Layout
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-zinc-400 mb-1 block font-medium">Font Family</span>
              <select
                value={field.formatting?.fontFamily || 'Courier'}
                onChange={(e) => updateFormatting({ fontFamily: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2.5 py-1.5 text-white text-xs font-mono focus:outline-none cursor-pointer"
              >
                <option value="Courier">Courier</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times-Roman">Times Roman</option>
                <option value="OCR-B">OCR-B</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400 mb-1 block font-medium">Size (pt)</span>
              <input
                type="number"
                step="0.5"
                value={field.formatting?.fontSize || 9.5}
                onChange={(e) => updateFormatting({ fontSize: parseFloat(e.target.value) || 9 })}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-md px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-zinc-400 mb-1 block font-medium">Alignment</span>
            <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
              {(['left', 'center', 'right'] as TextAlignment[]).map((align) => {
                const isSelected = (field.formatting?.align || 'left') === align;
                return (
                  <button
                    key={align}
                    type="button"
                    onClick={() => updateFormatting({ align })}
                    className={`flex items-center justify-center py-1 rounded text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {align === 'left' && <AlignLeft className="w-3.5 h-3.5 mr-1" />}
                    {align === 'center' && <AlignCenter className="w-3.5 h-3.5 mr-1" />}
                    {align === 'right' && <AlignRight className="w-3.5 h-3.5 mr-1" />}
                    <span className="capitalize">{align}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </aside>
  );
};
