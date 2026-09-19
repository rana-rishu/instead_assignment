/**
 * Instead Tax Form Annotation Specification - TypeScript Definition
 * Standardized schema for field positioning, visual formatting, and deeply nested data binding on U.S. Tax Forms.
 */

export type MeasurementUnit = 'pt' | 'mm' | 'in' | 'px' | 'percentage';
export type CoordinateOrigin = 'top-left' | 'bottom-left';

export type FormFieldCategory =
  | 'IDENTITY'
  | 'FILING_STATUS'
  | 'INCOME'
  | 'ADJUSTMENTS'
  | 'DEDUCTIONS'
  | 'TAX_AND_CREDITS'
  | 'PAYMENTS'
  | 'REFUND'
  | 'SIGNATURE'
  | 'PREPARER'
  | 'OTHER';

export type FormFieldType =
  | 'TEXT'
  | 'CURRENCY'
  | 'COMB_TEXT'
  | 'CHECKBOX'
  | 'RADIO_GROUP'
  | 'DATE'
  | 'SSN'
  | 'EIN'
  | 'PHONE'
  | 'BARCODE';

export type TransformPipeline =
  | 'NONE'
  | 'UPPERCASE'
  | 'LOWERCASE'
  | 'TITLE_CASE'
  | 'SSN_HYPHENATED'
  | 'SSN_UNMASKED_DIGITS'
  | 'SSN_MASKED_FIRST_FIVE'
  | 'EIN_HYPHENATED'
  | 'CURRENCY_NO_CENTS'
  | 'CURRENCY_WITH_CENTS'
  | 'CURRENCY_ROUND_NEAREST_DOLLAR'
  | 'DATE_MMDDYYYY'
  | 'DATE_YYYYMMDD'
  | 'PHONE_US'
  | 'BOOLEAN_TO_X'
  | 'BOOLEAN_TO_CHECK'
  | 'BOOLEAN_TO_FILLED_BOX'
  | 'EXTRACT_YEAR'
  | 'CUSTOM_EXPRESSION';

export type OverflowStrategy = 'shrink_to_fit' | 'clip' | 'wrap' | 'ellipsis';
export type TextAlignment = 'left' | 'center' | 'right' | 'justify';
export type VerticalAlignment = 'top' | 'middle' | 'bottom';
export type CheckboxMarkerType = 'X' | 'CHECK' | 'FILLED' | 'CIRCLE' | 'DOT';
export type NegativeCurrencyFormat = 'PARENTHESES' | 'MINUS' | 'TRAILING_MINUS';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  unit?: MeasurementUnit;
}

export interface DataBinding {
  /**
   * JSONPath or dot notation path (e.g., `$.taxpayer.personalInfo.firstName`, `$.returns[0].w2[0].wages`)
   */
  path: string;
  /**
   * Fallback default value if path resolves to undefined/null
   */
  fallback?: string;
  /**
   * Value transformation pipeline applied before rendering
   */
  transform?: TransformPipeline;
  /**
   * Optional boolean expression to determine if field should be rendered
   * e.g., "taxpayer.filingStatus == 'MFJ'"
   */
  condition?: string;
  /**
   * Custom JavaScript/Python safe expression when transform is 'CUSTOM_EXPRESSION'
   */
  customExpression?: string;
}

export interface TypographyFormatting {
  fontFamily?: 'Courier' | 'Helvetica' | 'Times-Roman' | 'OCR-B' | 'Inter' | string;
  fontSize?: number;
  minFontSize?: number;
  fontWeight?: 'normal' | 'bold' | 400 | 500 | 600 | 700;
  fontStyle?: 'normal' | 'italic';
  color?: string; // Hex color, e.g. #000000, #000080
  align?: TextAlignment;
  verticalAlign?: VerticalAlignment;
  lineHeight?: number;
  letterSpacing?: number;
  overflowStrategy?: OverflowStrategy;
  textCase?: 'none' | 'upper' | 'lower';
}

export interface CombBoxConfig {
  /**
   * Total number of character cells in the comb box (e.g., 9 for SSN, 10 for Phone)
   */
  cellCount: number;
  /**
   * Individual width of each cell in coordinate units (pt)
   */
  cellWidth: number;
  /**
   * Gap between consecutive individual cells within a group (pt)
   */
  cellGap?: number;
  /**
   * Group partition sizes (e.g., [3, 2, 4] for SSN: XXX-XX-XXXX, [2, 7] for EIN: XX-XXXXXXX)
   */
  groups?: number[];
  /**
   * Distance/gap between groups in points
   */
  groupGaps?: number[];
  /**
   * Optional delimiter printed in group gaps (e.g. '-')
   */
  delimiter?: string;
  /**
   * Padding direction if string length is less than cellCount
   */
  autoPad?: 'left' | 'right' | 'none';
  padChar?: string;
  characterAlignment?: 'center' | 'left' | 'right';
}

export interface CurrencyConfig {
  includeSymbol?: boolean; // If true, renders '$', default false (IRS forms have '$' preprinted)
  includeDecimals?: boolean; // If true, renders .00, default false for Form 1040 whole dollars
  thousandsSeparator?: string; // e.g. ','
  decimalSeparator?: string; // e.g. '.'
  negativeFormat?: NegativeCurrencyFormat; // 'PARENTHESES' (1,000) or 'MINUS' -1,000
  zeroDisplay?: 'ZERO' | 'DASH' | 'BLANK';
  centsBoxOffset?: number; // X-offset for distinct cents sub-box if split
}

export interface CheckboxConfig {
  marker: CheckboxMarkerType;
  markerSize?: number;
  checkedValues?: Array<string | number | boolean>;
  radioValue?: string; // For radio group choices: marks if resolved value === radioValue
}

export interface TableRepeatConfig {
  arrayPath: string; // JSONPath to array, e.g. '$.taxpayer.dependents'
  maxRows: number;
  rowHeight: number; // Y-offset increment per row in points
  columns: {
    columnKey: string;
    label: string;
    xOffset: number;
    width: number;
    field: Partial<FormFieldAnnotation>;
  }[];
}

export interface ValidationRule {
  required?: boolean;
  regex?: string;
  min?: number;
  max?: number;
  customRule?: string;
  errorMessage?: string;
}

export interface AuditMetadata {
  irsFormRef?: string; // e.g. 'F1040_Line_1z'
  xmlMefTag?: string; // IRS Modernized e-File XML tag, e.g. '<WagesSalariesAndTipsAmt>'
  notes?: string;
  taxLawReference?: string; // IRC Section reference
}

export interface FormFieldAnnotation {
  id: string;
  boxNumber: string; // Official IRS Box/Line reference (e.g., "1z", "SSN", "Box 12a")
  label: string; // Human descriptive label
  description?: string;
  pageIndex: number; // 1-indexed (Page 1, Page 2, ...)
  category: FormFieldCategory;
  fieldType: FormFieldType;
  bounds: BoundingBox;
  dataBinding?: DataBinding;
  formatting?: TypographyFormatting;
  combConfig?: CombBoxConfig;
  currencyConfig?: CurrencyConfig;
  checkboxConfig?: CheckboxConfig;
  tableRepeatConfig?: TableRepeatConfig;
  validation?: ValidationRule;
  audit?: AuditMetadata;
  zIndex?: number;
  locked?: boolean;
  hidden?: boolean;
}

export interface PageDimension {
  pageIndex: number; // 1-indexed
  width: number; // Default 612 pt (8.5 inches)
  height: number; // Default 792 pt (11.0 inches)
  unit: MeasurementUnit;
  dpi: number; // Default 72
  origin: CoordinateOrigin;
  backgroundSvg?: string;
  backgroundImageUrl?: string;
  title?: string;
}

export interface FormAnnotationSpec {
  $schema?: string;
  specVersion: string; // e.g. '1.0.0'
  formId: string; // e.g. 'IRS-FORM-1040'
  formTitle: string; // 'U.S. Individual Income Tax Return'
  taxYear: number; // 2024
  revision: string; // '2024-Rev-01'
  publisher: string; // 'Internal Revenue Service (IRS)'
  description?: string;
  pages: PageDimension[];
  fields: FormFieldAnnotation[];
  metadata?: {
    author?: string;
    createdAt?: string;
    updatedAt?: string;
    standard?: 'INSTEAD-TAX-SPEC-V1';
    compatibleEngines?: string[];
  };
}

export interface ResolvedFieldEvaluation {
  fieldId: string;
  boxNumber: string;
  label: string;
  rawValue: any;
  formattedValue: string;
  isValid: boolean;
  validationErrors?: string[];
  renderedSegments?: {
    char: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}
