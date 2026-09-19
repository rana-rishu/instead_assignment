import { FormAnnotationSpec, FormFieldAnnotation } from '../types/annotation';

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  fieldId?: string;
  boxNumber?: string;
  message: string;
}

export function validateFormSpec(spec: FormAnnotationSpec): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!spec.formId || spec.formId.trim() === '') {
    issues.push({ type: 'error', message: 'Form ID is required.' });
  }

  if (!spec.pages || spec.pages.length === 0) {
    issues.push({ type: 'error', message: 'Form must have at least one page definition.' });
  }

  const fieldIds = new Set<string>();

  spec.fields.forEach((field, idx) => {
    // Duplicate ID check
    if (fieldIds.has(field.id)) {
      issues.push({
        type: 'error',
        fieldId: field.id,
        boxNumber: field.boxNumber,
        message: `Duplicate field ID detected: "${field.id}". IDs must be globally unique.`,
      });
    }
    fieldIds.add(field.id);

    // Page index bounds check
    const targetPage = spec.pages.find((p) => p.pageIndex === field.pageIndex);
    if (!targetPage) {
      issues.push({
        type: 'error',
        fieldId: field.id,
        boxNumber: field.boxNumber,
        message: `Field references pageIndex ${field.pageIndex}, but only ${spec.pages.length} page(s) exist.`,
      });
    } else {
      // Coordinate out-of-bounds check
      if (
        field.bounds.x < 0 ||
        field.bounds.y < 0 ||
        field.bounds.x + field.bounds.width > targetPage.width ||
        field.bounds.y + field.bounds.height > targetPage.height
      ) {
        issues.push({
          type: 'warning',
          fieldId: field.id,
          boxNumber: field.boxNumber,
          message: `Field bounds [x:${field.bounds.x}, y:${field.bounds.y}, w:${field.bounds.width}, h:${field.bounds.height}] exceed page boundaries (${targetPage.width}x${targetPage.height} pt).`,
        });
      }
    }

    // Dimension check
    if (field.bounds.width <= 0 || field.bounds.height <= 0) {
      issues.push({
        type: 'error',
        fieldId: field.id,
        boxNumber: field.boxNumber,
        message: `Invalid bounding box dimensions for field ${field.boxNumber}. Width and height must be positive.`,
      });
    }

    // Comb box check
    if (field.fieldType === 'COMB_TEXT' && !field.combConfig) {
      issues.push({
        type: 'warning',
        fieldId: field.id,
        boxNumber: field.boxNumber,
        message: `Field ${field.boxNumber} is COMB_TEXT but combConfig is missing. Defaulting to 9 cells.`,
      });
    }

    // Data binding check
    if (!field.dataBinding?.path) {
      issues.push({
        type: 'info',
        fieldId: field.id,
        boxNumber: field.boxNumber,
        message: `Field ${field.boxNumber} has no data binding path. Will render empty or default.`,
      });
    }
  });

  return issues;
}
