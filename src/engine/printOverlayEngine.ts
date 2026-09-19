import jsPDF from 'jspdf';
import { FormAnnotationSpec, FormFieldAnnotation } from '../types/annotation';
import { applyTransform, resolveDataPath } from './jsonPathResolver';
import { calculateCombCells } from './combFormatter';
import { SVG_TEMPLATES } from '../mockData/svgTemplates';

export interface GeneratePdfOptions {
  includeBackground?: boolean;
  pageIndex?: number;
  highlightBoxes?: boolean;
  selectedFieldId?: string | null;
}

/**
 * Converts an SVG string into a crisp PNG Data URL via an offscreen Canvas
 */
async function svgToPngDataUrl(svgString: string, width: number, height: number): Promise<string> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const scale = 2; // 2x high resolution
          canvas.width = width * scale;
          canvas.height = height * scale;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            URL.revokeObjectURL(url);
            resolve(dataUrl);
            return;
          }
        } catch (err) {
          console.warn('Canvas rasterization error:', err);
        }
        URL.revokeObjectURL(url);
        resolve('');
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('');
      };

      img.src = url;
    } catch {
      resolve('');
    }
  });
}

/**
 * Generates an ultra-crisp vector PDF with values printed in exact tax form box coordinates.
 * Compatible with pre-printed IRS forms (data-only overlay mode) or complete visual forms.
 */
export async function generateTaxFormPdf(
  spec: FormAnnotationSpec,
  dataset: any,
  options: GeneratePdfOptions = {}
): Promise<jsPDF> {
  const { includeBackground = true, pageIndex } = options;

  // Initialize jsPDF with letter size and point units (72pt/inch)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter', // 612 x 792 pt
  });

  const pagesToRender = pageIndex
    ? spec.pages.filter((p) => p.pageIndex === pageIndex)
    : spec.pages;

  for (let pIdx = 0; pIdx < pagesToRender.length; pIdx++) {
    const page = pagesToRender[pIdx];
    if (pIdx > 0) {
      doc.addPage('letter', 'portrait');
    }

    // Embed background IRS form template
    if (includeBackground) {
      const svgKey = `${spec.formId}-${page.pageIndex}`;
      const svgContent = SVG_TEMPLATES[svgKey] || SVG_TEMPLATES[`${spec.formId}-1`];
      if (svgContent) {
        try {
          const pngData = await svgToPngDataUrl(svgContent, page.width, page.height);
          if (pngData) {
            doc.addImage(pngData, 'PNG', 0, 0, page.width, page.height);
          }
        } catch (err) {
          console.warn('Could not embed background image in PDF:', err);
        }
      }
    }

    // Fields for this page
    const pageFields = spec.fields.filter((f) => f.pageIndex === page.pageIndex && !f.hidden);

    for (const field of pageFields) {
      renderFieldOnPdf(doc, field, dataset, options);
    }
  }

  return doc;
}

function renderFieldOnPdf(
  doc: jsPDF,
  field: FormFieldAnnotation,
  dataset: any,
  options: GeneratePdfOptions
) {
  const rawVal = field.dataBinding?.path ? resolveDataPath(dataset, field.dataBinding.path) : undefined;
  const formattedVal = applyTransform(rawVal, field.dataBinding?.transform || 'NONE', field);

  const bounds = field.bounds;
  const fontFam = mapPdfFont(field.formatting?.fontFamily);
  const fontSize = field.formatting?.fontSize || 9.5;
  const fontStyle = field.formatting?.fontStyle === 'italic' ? 'italic' : (field.formatting?.fontWeight === 'bold' ? 'bold' : 'normal');

  doc.setFont(fontFam, fontStyle);
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);

  // Optional visual highlight boxes for inspection/debug print
  if (options.highlightBoxes) {
    const isSelected = options.selectedFieldId === field.id;
    if (isSelected) {
      doc.setDrawColor(196, 139, 89); // Brand Coffee Caramel
      doc.setLineWidth(1.5);
    } else {
      doc.setDrawColor(210, 195, 180);
      doc.setLineWidth(0.5);
    }
    doc.rect(bounds.x, bounds.y, bounds.width, bounds.height);
  }

  if (!formattedVal) return;

  // Render based on Field Type
  if (field.fieldType === 'COMB_TEXT' && field.combConfig) {
    const cells = calculateCombCells(formattedVal, bounds, field.combConfig);
    const yCenter = bounds.y + bounds.height * 0.75;

    for (const cell of cells) {
      if (cell.char) {
        const xCenter = cell.x + cell.width / 2;
        doc.text(cell.char, xCenter, yCenter, { align: 'center' });
      }
    }
  } else if (field.fieldType === 'CHECKBOX' || field.fieldType === 'RADIO_GROUP') {
    const marker = formattedVal || (field.checkboxConfig?.marker === 'CHECK' ? '✓' : 'X');
    const xCenter = bounds.x + bounds.width / 2;
    const yCenter = bounds.y + bounds.height * 0.75;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(Math.max(fontSize, 10));
    doc.text(marker, xCenter, yCenter, { align: 'center' });
  } else if (field.fieldType === 'CURRENCY') {
    const align = field.formatting?.align || 'right';
    const xPos = align === 'right' ? bounds.x + bounds.width - 2 : bounds.x + 2;
    const yPos = bounds.y + bounds.height * 0.75;
    doc.text(formattedVal, xPos, yPos, { align });
  } else {
    // Standard Text
    const align = field.formatting?.align || 'left';
    let xPos = bounds.x + 2;
    if (align === 'center') xPos = bounds.x + bounds.width / 2;
    else if (align === 'right') xPos = bounds.x + bounds.width - 2;

    const yPos = bounds.y + bounds.height * 0.75;
    doc.text(formattedVal, xPos, yPos, { align });
  }
}

function mapPdfFont(fontFamily?: string): 'courier' | 'helvetica' | 'times' {
  if (!fontFamily) return 'courier';
  const lower = fontFamily.toLowerCase();
  if (lower.includes('helvetica') || lower.includes('sans') || lower.includes('inter')) return 'helvetica';
  if (lower.includes('times') || lower.includes('serif')) return 'times';
  return 'courier';
}
