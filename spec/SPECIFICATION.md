# Instead U.S. Tax Form Annotation Specification (v1.0.0)

## 1. Executive Summary & Design Goals
The **Instead Tax Form Annotation Specification** defines an open, robust, cross-platform schema for digitizing, locating, validating, and printing data onto United States Federal and State tax forms (e.g., IRS Form 1040, Form W-2, Schedule C, Form 1099-NEC).

### Key Technical Objectives
1. **Micro-Positioning Accuracy**: Millimeter/Point (1/72 inch) vector coordinate precision compatible with native PDF canvas renderers (`pdf-lib`, `reportlab`, `jspdf`, Skia).
2. **Deeply Nested Data Resolution**: Deterministic resolution of complex hierarchical taxpayer datasets (e.g. `$.taxpayer.dependents[0].identity.ssn` or `$.returns[2024].income.w2Forms[?(@.primary==true)].box1Wages`).
3. **Complex Form Modalities**:
   - Single-line and multi-line bounded text.
   - Character comb boxes / segmented cells (SSN, EIN, routing numbers, boxed currency digits).
   - Right-aligned financial currency formatting (optional cents, negative parenthetical notations like `($12,450)`).
   - Discrete boolean checkboxes (`[X]`, `[✓]`, filled squares) and exclusive radio groups (Filing Status).
   - Repeating dynamic schedules (Itemized deductions, Dependents grid).
4. **Platform Independence**: Standardized JSON Schema with native bindings in TypeScript, Python Pydantic, and Go.

---

## 2. Coordinate System & Geometry Model

### 2.1 Units and Standards
Tax forms are anchored to the standard PostScript point system:
$$\text{1 Point (pt)} = \frac{1}{72} \text{ inch} \approx 0.3527 \text{ mm}$$

A standard US Letter page measures:
$$\text{Width} = 8.5 \text{ in} \times 72 \text{ pt/in} = 612 \text{ pt}$$
$$\text{Height} = 11.0 \text{ in} \times 72 \text{ pt/in} = 792 \text{ pt}$$

```json
{
  "pageIndex": 1,
  "width": 612,
  "height": 792,
  "unit": "pt",
  "dpi": 72,
  "origin": "top-left"
}
```

### 2.2 Origin Transformation
Web canvases and SVG render with `origin: top-left` $(x=0, y=0 \text{ at top-left})$, while PDF specifications (ISO 32000-1) define $(0,0)$ at `bottom-left`.

The transformation between Web coordinates $(x_{\text{web}}, y_{\text{web}})$ and PDF coordinates $(x_{\text{pdf}}, y_{\text{pdf}})$ is:
$$x_{\text{pdf}} = x_{\text{web}}$$
$$y_{\text{pdf}} = H_{\text{page}} - (y_{\text{web}} + \text{height}_{\text{box}})$$

---

## 3. Data Binding & Nested Path Resolution

Tax data is inherently hierarchical, multi-entity, and multi-year. The specification uses standard **JSONPath** notation:

| Expression | Target Resolution | Example Output |
| :--- | :--- | :--- |
| `$.taxpayer.personalInfo.firstName` | Root taxpayer's first name | `"Alex"` |
| `$.taxpayer.identity.ssn` | Primary SSN | `"000123456"` |
| `$.returns[0].w2[0].wages` | First W-2 Box 1 wages | `124500.00` |
| `$.taxpayer.dependents[1].firstName` | Second dependent's first name | `"Liam"` |
| `$.taxpayer.filingStatus` | Filing status code | `"MFJ"` |

### 3.1 Transformation Pipeline
Extracted values pass through formatting pipelines:
- `UPPERCASE`: Converts text to all caps (IRS standard for address lines).
- `SSN_HYPHENATED`: Transforms `123456789` $\rightarrow$ `123-45-6789`.
- `SSN_UNMASKED_DIGITS`: Strips hyphens and letters for comb box ingestion.
- `SSN_MASKED_FIRST_FIVE`: Transforms `123456789` $\rightarrow$ `***-**-6789`.
- `EIN_HYPHENATED`: Transforms `123456789` $\rightarrow$ `12-3456789`.
- `CURRENCY_NO_CENTS`: Whole-dollar rounding with commas: `12450.40` $\rightarrow$ `12,450`.
- `CURRENCY_WITH_CENTS`: Standard two-decimal currency: `12450.40` $\rightarrow$ `12,450.40`.
- `BOOLEAN_TO_X`: Renders `"X"` if truthy, otherwise empty string.

---

## 4. Field Modalities

### 4.1 Comb Box (Segmented Character Cells)
Many IRS fields (SSN, EIN, Account Numbers, Name Grids) require each character to sit within its own discrete visual box.

$$\text{Cell } i \text{ X-Position} = X_{\text{box}} + (i \times (\text{cellWidth} + \text{cellGap})) + \sum \text{groupGaps}$$

```json
{
  "fieldType": "COMB_TEXT",
  "combConfig": {
    "cellCount": 9,
    "cellWidth": 13.5,
    "cellGap": 1.5,
    "groups": [3, 2, 4],
    "groupGaps": [8.0, 8.0],
    "delimiter": "-",
    "characterAlignment": "center"
  }
}
```

### 4.2 Currency Fields
Supports right-alignment, automatic negative parenthetical wrapping `($1,234)`, and whole-dollar suppression of cents according to IRS Form 1040 instructions.

```json
{
  "fieldType": "CURRENCY",
  "currencyConfig": {
    "includeSymbol": false,
    "includeDecimals": false,
    "thousandsSeparator": ",",
    "negativeFormat": "PARENTHESES",
    "zeroDisplay": "BLANK"
  }
}
```

### 4.3 Checkboxes & Radio Choice Groups
Checkboxes evaluate truthy conditions (`true`, `"YES"`, `1`). Radio groups match the resolved value against `radioValue`.

```json
{
  "fieldType": "RADIO_GROUP",
  "checkboxConfig": {
    "marker": "X",
    "markerSize": 11,
    "radioValue": "SINGLE"
  }
}
```

---

## 5. Extensibility & Future Enhancements

1. **OCR / Computer Vision Auto-Alignment**: AI/Computer vision pipeline to auto-detect IRS form boxes from PDF vector paths.
2. **IRS MeF XML Round-Trip Binding**: Direct synchronization with IRS Modernized e-File XML tags (`<WagesSalariesAndTipsAmt>`).
3. **Calculated / Derived Formulas**: Dynamic field calculation formulas e.g. `sum(Line1a..Line1h)` directly within the annotation spec.
4. **Conditional Overflow Addendums**: When list items (e.g. 6 dependents) exceed form capacity (4 lines), auto-spill onto IRS "Statement / Schedule Continuation Sheet".
5. **Electronic Signature Cryptographic Anchors**: Embedded cryptographic metadata for IRS Form 8879 e-signatures.
