# DocuTax Studio • Full Technical Documentation & Architecture Guide

> **Instead Technical Assessment** • Interactive U.S. Tax Form Annotation Specification & Vector Print Studio  
> Built with **Cal.com's Developer-First Minimalist Design Language**

---

## Table of Contents
1. [Executive Summary & Core Concept](#1-executive-summary--core-concept)
2. [Tech Stack & Library Rationale](#2-tech-stack--library-rationale)
3. [System Architecture & Data Flow](#3-system-architecture--data-flow)
4. [Component & Button-by-Button Functionality](#4-component--button-by-button-functionality)
   - [Top Navbar](#a-top-navbar)
   - [Left Field List Sidebar](#b-left-field-list-sidebar)
   - [Center Interactive Canvas](#c-center-interactive-canvas)
   - [Right Bento Field Inspector](#d-right-bento-field-inspector)
   - [Nested Data Drawer (Tax Return IDE)](#e-nested-data-drawer)
   - [Command Palette (⌘K)](#f-command-palette-k)
5. [Core Mathematical & Processing Engines](#5-core-mathematical--processing-engines)
   - [JSONPath Resolver & Pipeline Transforms](#1-jsonpath-resolver--pipeline-transforms)
   - [Comb Box Segmentation & Arithmetic](#2-comb-box-segmentation--arithmetic)
   - [jsPDF Vector 1-Click Print Engine](#3-jspdf-vector-1-click-print-engine)
6. [Design System Tokens (Cal.com Aesthetic)](#6-design-system-tokens-calcom-aesthetic)
7. [Automated Test Suite & Verification](#7-automated-test-suite--verification)

---

## 1. Executive Summary & Core Concept

U.S. tax forms (e.g., IRS Form 1040, W-2, 1099-NEC) are rigid, non-flowable layouts governed by precise physical coordinates (**72 PostScript points per inch**). Standard HTML-to-PDF tools or responsive web forms cause critical alignment errors when printing onto official tax forms or pre-printed IRS blank paper.

**DocuTax Studio** implements a **fully decoupled architecture**:
- **Form Layout Specification (`FormAnnotationSpec`):** Declares physical box coordinates ($X, Y, W, H$), data bindings, comb partitions, typography, and validation rules.
- **Taxpayer Return Dataset (`JSON`):** An arbitrary, deeply-nested JSON structure containing taxpayer demographics, W-2 wage forms, schedule items, and calculations.
- **Visual Studio:** An interactive dark-mode CAD workspace for drag-and-drop repositioning, comb box partitioning, and live data simulation.
- **Vector Overlay Engine:** Produces pixel-perfect, 72 pt/inch vector PDFs with direct 1-click execution.

---

## 2. Tech Stack & Library Rationale

| Technology / Library | Version | Purpose & Architectural Rationale |
| :--- | :--- | :--- |
| **React** | `18.3.1` | Declarative, component-driven UI with instant state updates for canvas interactions. |
| **TypeScript** | `5.7.2` | 100% strict type safety across form schemas, geometry models, and transform pipelines. |
| **Vite** | `6.1.0` | Ultra-fast local dev server and optimized production bundler. |
| **Tailwind CSS** | `3.4.17` | Utility-first styling framework configured with Cal.com zinc monochrome tokens. |
| **jsPDF** | `2.5.2` | Direct client-side vector PDF generation at 72 pt/in, bypassing browser print scaling issues. |
| **Lucide React** | `0.475.0` | Clean, minimalist open-source vector icon suite. |
| **clsx & tailwind-merge** | `2.1 / 3.0` | Dynamic class joining and conflict-free Tailwind utility merging (`cn`). |
| **Cal Sans** | `WOFF2` | Open-source geometric sans font from Cal.com for headers and brand typography. |
| **JetBrains Mono** | `Google Fonts` | High-legibility monospace font for tabular digits, coordinates, and JSONPaths. |

---

## 3. System Architecture & Data Flow

```
┌───────────────────────────────┐     ┌────────────────────────────────┐
│ Taxpayer Return Payload (JSON)│     │ Form Annotation Spec (JSON)    │
└───────────────┬───────────────┘     └───────────────┬────────────────┘
                │                                     │
                └──────────────────┬──────────────────┘
                                   ▼
                ┌─────────────────────────────────────┐
                │ 1. JSONPath & Transform Resolver    │
                │    (src/engine/jsonPathResolver.ts) │
                └──────────────────┬──────────────────┘
                                   ▼
                ┌─────────────────────────────────────┐
                │ 2. Comb Box Arithmetic Engine       │
                │    (src/engine/combFormatter.ts)    │
                └──────────────────┬──────────────────┘
                                   ▼
          ┌────────────────────────┴────────────────────────┐
          ▼                                                 ▼
┌───────────────────────────────────┐     ┌──────────────────────────────────┐
│ Live Interactive Workspace        │     │ 1-Click Vector PDF Engine        │
│ • Canvas Annotator (SVG + Boxes)  │     │ • 72 pt/in coordinate mapping    │
│ • Bento Property Inspector        │     │ • Direct download & print dialog │
│ • Command Palette (⌘K)            │     │   (src/engine/printOverlayEngine)│
└───────────────────────────────────┘     └──────────────────────────────────┘
```

---

## 4. Component & Button-by-Button Functionality

### A. Top Navbar (`src/components/Navbar.tsx`)
- **Brand Logo (`D` + `DocuTax STUDIO`):** Displays Cal.com styled brand badge and system status.
- **Search Bar (`Search fields & actions... ⌘K`):** Triggers the global Command Palette. Keyboard shortcut: `⌘K` or `Ctrl+K`.
- **Form Selector Dropdown:** Switches active tax form (e.g. `IRS-FORM-1040` vs `IRS-FORM-W2`), automatically reloading fields and background templates.
- **Page Tabs (`Page 1`, `Page 2`):** Switches pages in multi-page tax forms.
- **Mode Switcher (`Annotate` vs `Live Data` - `Tab`):**
  - *Annotate Mode:* Displays editable bounding boxes, coordinate labels, and 8-point resize handles.
  - *Live Data Mode:* Hides overlays to render the clean preview of the return filled with live data.
- **Zoom Controls (`-`, `100%`, `+`):** Scales the studio canvas from `50%` to `200%`.
- **`Dataset` Button (`{bound}/{total}`):** Opens the bottom JSON IDE Drawer.
- **`Export JSON Spec` Button (`⌘E`):** Downloads the active layout specification as `[formId]_annotation_spec.json`.
- **`Print PDF` Button (Signature Cal.com White CTA - `⌘P`):** Generates vector PDF, saves `.pdf` file, and opens the native print preview window in a single click.

---

### B. Left Field List Sidebar (`src/components/FieldListSidebar.tsx`)
- **`+ New` Button:** Spawns a new customizable field annotation on the active page.
- **Search Input:** Real-time fuzzy filtering across box numbers (e.g., `1a`, `12`), labels, and JSONPaths.
- **Category Filter Pills (`ALL`, `IDENTITY`, `INCOME`, `DEDUCTIONS`, etc.):** Filters fields by IRS category taxonomy.
- **Bento List Items:**
  - Displays Box Number badge, label, data path, and real-time resolved value.
  - Emerald dot indicator confirms active data binding.

---

### C. Center Interactive Canvas (`src/components/CanvasAnnotator.tsx`)
- **Vector IRS SVG Layer:** High-definition vector tax form background template.
- **Interactive Bounding Box Overlays:**
  - **Drag to Move:** Drag anywhere inside the bounding box to reposition in points (`pt`).
  - **8-Point Precision Resize Handles:** NW, N, NE, E, SE, S, SW, W handles for exact bounds.
- **Comb Box Cell Rendering:** Renders individual digits in separate partitioned cells (e.g. SSN `3-2-4`).
- **Bottom HUD:** Displays live cursor X/Y coordinates in points (`72 pt/in`), page dimensions, and total box count.

---

### D. Right Bento Field Inspector (`src/components/FieldInspector.tsx`)
- **`Duplicate` & `Delete` Buttons:** Clones or deletes the selected annotation field.
- **Bento Card 1: Resolved Preview:** Real-time preview of the resolved return value with bound/unbound validation.
- **Bento Card 2: Field Identity:** Edits `Box Number`, `Category`, `Label`, and `Field Type` (`TEXT`, `CURRENCY`, `COMB_TEXT`, `CHECKBOX`, `RADIO_GROUP`, `DATE`, `PHONE`).
- **Bento Card 3: Bounds (Points):** Numeric inputs for `X`, `Y`, `Width`, and `Height` at 72 pt/in.
- **Bento Card 4: Data Binding:**
  - JSONPath input with autocomplete dropdown extracted from dataset.
  - Transform Pipeline selector (12+ built-in transformers).
- **Bento Card 5: Comb Box Segmentation:** Cell count, cell width, cell gap, and partition groups (e.g., `3, 2, 4` for SSN).
- **Bento Card 6: Typography & Layout:** Font family (`Courier`, `Helvetica`, `Times-Roman`, `OCR-B`), font size, and text alignment (`[ Left | Center | Right ]`).

---

### E. Nested Data Drawer (`src/components/NestedDataDrawer.tsx`)
- **Monaco-style JSON Editor:** Live editing of the taxpayer return dataset.
- **`Format` Action:** Auto-formats and indents JSON payload.
- **`Copy` Action:** Copies dataset to clipboard.
- **Error Boundary:** Live JSON syntax validator with instant error messaging.

---

### F. Command Palette (`src/components/ui/CommandPalette.tsx`)
- Triggered by **`⌘K`** / **`Ctrl+K`**.
- Instant keyboard search across all form fields, jump to coordinates, toggle modes, print PDF, or export JSON spec.

---

## 5. Core Mathematical & Processing Engines

### 1. JSONPath Resolver & Pipeline Transforms (`src/engine/jsonPathResolver.ts`)
Resolves arbitrary nested dot-notation and array indices:
- `$.taxpayer.personalInfo.firstName` $\rightarrow$ `"John"`
- `$.income.w2Forms[0].box1Wages` $\rightarrow$ `85000`
- `$.taxpayer.dependents[1].ssn` $\rightarrow$ `"987654321"`

**Transform Pipelines:**
- `SSN_HYPHENATED`: `123456789` $\rightarrow$ `123-45-6789`
- `SSN_MASKED_FIRST_FIVE`: `123456789` $\rightarrow$ `***-**-6789`
- `EIN_HYPHENATED`: `123456789` $\rightarrow$ `12-3456789`
- `CURRENCY_NO_CENTS`: `12450.75` $\rightarrow$ `12,451` (negative values formatted as `(12,451)`)
- `BOOLEAN_TO_X`: `true` $\rightarrow$ `X`

---

### 2. Comb Box Segmentation & Arithmetic (`src/engine/combFormatter.ts`)
Calculates exact coordinate anchor points for segmented character boxes (e.g. IRS SSN boxes with `3-2-4` group gaps):

$$\text{Cell}_i.x = X_{\text{origin}} + \sum (w_c + g) + \text{GroupGap}$$

Handles auto-padding (`left`, `right`), group gaps, and delimiters.

---

### 3. jsPDF Vector 1-Click Print Engine (`src/engine/printOverlayEngine.ts`)
- Standard US Letter (`612 x 792 pt` at `72 pt/in`).
- Embeds crisp vector template layer + vector text drawing.
- **1-Click Execution:** Generates blob, triggers direct PDF download, and dispatches native browser print stream.

---

## 6. Design System Tokens (Cal.com Aesthetic)

- **Palette:** Pure Black (`#000000`), Dark Zinc (`#09090b`, `#121215`, `#18181c`), Zinc Borders (`border-zinc-800`).
- **Primary CTA:** Solid White (`bg-white text-zinc-950 font-semibold hover:bg-zinc-100 active:scale-[0.96] shadow-[0_1px_2px_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.12)]`).
- **Bento Cards:** `rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]`.
- **Canvas:** Dot matrix background pattern (`cal-bg-grid`) with ambient top spotlight lighting (`cal-spotlight`).

---

## 7. Automated Test Suite & Verification

Run the automated engine test suite:
```bash
npx tsx src/test_engine.ts
```

**Coverage (20/20 Passing Tests):**
1. Nested JSONPath Extraction (Arrays, nested keys, missing keys).
2. Transformation Pipeline (Currency, SSN masking, booleans).
3. Comb Box Geometry Arithmetic.
4. Specification Schema Validation (IRS 1040 and W-2 specs).
