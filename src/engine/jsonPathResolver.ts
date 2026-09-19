import { FormFieldAnnotation, ResolvedFieldEvaluation, TransformPipeline } from '../types/annotation';

/**
 * Resolves a nested JSONPath or dot notation path against an arbitrary data object.
 * Examples:
 *   - "$.taxpayer.personalInfo.firstName"
 *   - "taxpayer.w2Forms[0].box1Wages"
 *   - "$.returns.scheduleC.expenses.office"
 *   - "taxpayer.dependents[1].ssn"
 */
export function resolveDataPath(data: any, path: string): any {
  if (!path || data == null) return undefined;

  let cleanPath = path.trim();
  if (cleanPath.startsWith('$.')) {
    cleanPath = cleanPath.substring(2);
  } else if (cleanPath.startsWith('$')) {
    cleanPath = cleanPath.substring(1);
  }

  // Split on dots that are not inside brackets
  const parts = cleanPath.split(/\.(?![^\[]*\])/);
  let current: any = data;

  for (const part of parts) {
    if (!part || current == null) return undefined;

    // Check for array indexing e.g. "w2Forms[0]" or "[1]"
    const arrayMatch = part.match(/^([^\[]*)\[(\d+)\]$/);
    if (arrayMatch) {
      const propName = arrayMatch[1];
      const index = parseInt(arrayMatch[2], 10);

      if (propName) {
        current = current[propName];
      }
      if (Array.isArray(current) && index >= 0 && index < current.length) {
        current = current[index];
      } else {
        return undefined;
      }
    } else {
      current = current[part];
    }
  }

  return current;
}

/**
 * Formats a raw value using the specified transform pipeline and field configuration.
 */
export function applyTransform(rawVal: any, transform: TransformPipeline = 'NONE', field?: FormFieldAnnotation): string {
  if (rawVal === undefined || rawVal === null) {
    return field?.dataBinding?.fallback || '';
  }

  const strVal = String(rawVal);

  switch (transform) {
    case 'UPPERCASE':
      return strVal.toUpperCase();

    case 'LOWERCASE':
      return strVal.toLowerCase();

    case 'TITLE_CASE':
      return strVal.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

    case 'SSN_HYPHENATED': {
      const digits = strVal.replace(/\D/g, '');
      if (digits.length === 9) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
      }
      return strVal;
    }

    case 'SSN_UNMASKED_DIGITS':
      return strVal.replace(/\D/g, '');

    case 'SSN_MASKED_FIRST_FIVE': {
      const digits = strVal.replace(/\D/g, '');
      if (digits.length === 9) {
        return `***-**-${digits.slice(5)}`;
      }
      return strVal;
    }

    case 'EIN_HYPHENATED': {
      const digits = strVal.replace(/\D/g, '');
      if (digits.length === 9) {
        return `${digits.slice(0, 2)}-${digits.slice(2)}`;
      }
      return strVal;
    }

    case 'CURRENCY_NO_CENTS':
    case 'CURRENCY_ROUND_NEAREST_DOLLAR': {
      const num = Number(rawVal);
      if (isNaN(num)) return strVal;
      const rounded = Math.round(num);
      const formatted = Math.abs(rounded).toLocaleString('en-US');
      return num < 0 ? `(${formatted})` : formatted;
    }

    case 'CURRENCY_WITH_CENTS': {
      const num = Number(rawVal);
      if (isNaN(num)) return strVal;
      const formatted = Math.abs(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return num < 0 ? `(${formatted})` : formatted;
    }

    case 'BOOLEAN_TO_X':
      return isTruthy(rawVal) ? 'X' : '';

    case 'BOOLEAN_TO_CHECK':
      return isTruthy(rawVal) ? '✓' : '';

    case 'BOOLEAN_TO_FILLED_BOX':
      return isTruthy(rawVal) ? '■' : '';

    case 'PHONE_US': {
      const digits = strVal.replace(/\D/g, '');
      if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      }
      return strVal;
    }

    case 'EXTRACT_YEAR': {
      const match = strVal.match(/\b(19\d\d|20\d\d)\b/);
      return match ? match[1] : strVal;
    }

    default:
      break;
  }

  // Handle Field-Type specific defaults if no explicit transform overridden
  if (field?.fieldType === 'CURRENCY') {
    const num = Number(rawVal);
    if (!isNaN(num)) {
      const cfg = field.currencyConfig;
      if (num === 0 && cfg?.zeroDisplay === 'BLANK') return '';
      if (num === 0 && cfg?.zeroDisplay === 'DASH') return '-';

      const includeDec = cfg?.includeDecimals ?? false;
      const formatted = Math.abs(num).toLocaleString('en-US', {
        minimumFractionDigits: includeDec ? 2 : 0,
        maximumFractionDigits: includeDec ? 2 : 0,
      });
      const withSymbol = cfg?.includeSymbol ? `$${formatted}` : formatted;

      if (num < 0) {
        return cfg?.negativeFormat === 'MINUS' ? `-${withSymbol}` : `(${withSymbol})`;
      }
      return withSymbol;
    }
  }

  if (field?.fieldType === 'CHECKBOX') {
    const isChecked = isTruthy(rawVal);
    if (!isChecked) return '';
    const marker = field.checkboxConfig?.marker || 'X';
    if (marker === 'CHECK') return '✓';
    if (marker === 'FILLED') return '■';
    if (marker === 'DOT') return '●';
    return 'X';
  }

  if (field?.fieldType === 'RADIO_GROUP') {
    const targetVal = field.checkboxConfig?.radioValue;
    const isSelected = targetVal !== undefined ? String(rawVal).toUpperCase() === String(targetVal).toUpperCase() : isTruthy(rawVal);
    return isSelected ? (field.checkboxConfig?.marker === 'CHECK' ? '✓' : 'X') : '';
  }

  return strVal;
}

function isTruthy(val: any): boolean {
  if (val === true || val === 1 || val === 'true' || val === 'TRUE' || val === 'yes' || val === 'YES' || val === 'X' || val === 'x') {
    return true;
  }
  return false;
}

/**
 * Evaluates an annotation against a dataset and returns resolved value and validation result
 */
export function evaluateField(field: FormFieldAnnotation, dataset: any): ResolvedFieldEvaluation {
  let rawValue: any = undefined;

  if (field.dataBinding?.path) {
    rawValue = resolveDataPath(dataset, field.dataBinding.path);
  }

  const formattedValue = applyTransform(rawValue, field.dataBinding?.transform || 'NONE', field);

  const errors: string[] = [];
  if (field.validation?.required && (!formattedValue || formattedValue.trim() === '')) {
    errors.push(`Field ${field.boxNumber} (${field.label}) is required.`);
  }
  if (field.validation?.regex && formattedValue) {
    try {
      const re = new RegExp(field.validation.regex);
      if (!re.test(formattedValue)) {
        errors.push(field.validation.errorMessage || `Value "${formattedValue}" does not match required pattern.`);
      }
    } catch {
      // Regex compilation ignore
    }
  }

  return {
    fieldId: field.id,
    boxNumber: field.boxNumber,
    label: field.label,
    rawValue,
    formattedValue,
    isValid: errors.length === 0,
    validationErrors: errors.length > 0 ? errors : undefined,
  };
}
