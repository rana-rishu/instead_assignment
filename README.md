# DocuTax Studio • US Tax Form Annotation Specification & Studio

> Enterprise data structure specification and interactive developer studio for indexing, positioning, validating, and printing deeply nested taxpayer data onto U.S. Federal and State Tax Forms.
> 
> Redesigned with **Cal.com's Open-Source Minimalist Design Language** (Cal Sans, pure monochrome palette, tactile 3D buttons, Bento cards, and ⌘K Command Palette).

Built for the **Instead Technical Assessment** submission to `jaitee.wazalwar@instead.com`.

---

## 📖 Complete Documentation
For full architectural details, mathematical engines, JSONPath specifications, and button-by-button breakdowns, see:
👉 **[`DOCUMENTATION.md`](./DOCUMENTATION.md)**

---

## 🌟 Key Capabilities & Assessment Deliverables

| Requirement | Implementation Details | Deliverable Link |
| :--- | :--- | :--- |
| **1. Data Structure Spec** | Formal JSON Schema, TypeScript definitions, Python Pydantic models, and Go structs for tax box coordinates, comb segmentation, and typography. | [`spec/tax_form_annotation_schema.json`](./spec/tax_form_annotation_schema.json)<br>[`spec/schema.ts`](./spec/schema.ts)<br>[`spec/models.py`](./spec/models.py)<br>[`spec/spec_engine.go`](./spec/spec_engine.go) |
| **2. Deeply Nested Data Binding** | Deterministic JSONPath / dot-notation engine (e.g., `$.taxpayer.dependents[0].ssn`, `$.income.w2Forms[0].box1Wages`) with fallback pipelines. | [`src/engine/jsonPathResolver.ts`](./src/engine/jsonPathResolver.ts) |
| **3. Complex Box Modalities** | Character comb boxes (SSN/EIN 9-digit segmented cells), right-aligned financial currency with negative parenthetical wrapping `($1,234)`, boolean checkboxes `[X]`, and radio groups. | [`src/engine/combFormatter.ts`](./src/engine/combFormatter.ts) |
| **4. Micro-Positioning & Units** | PostScript 72 pt/in coordinate standard with Web (`top-left`) to PDF (`bottom-left`) origin transformation math. | [`spec/SPECIFICATION.md`](./spec/SPECIFICATION.md) |
| **5. Cal.com Minimalist Studio** | Pure monochrome black & zinc theme, Cal Sans typography, Bento cards, 8-handle precision CAD resize, and ⌘K command palette. | [`src/App.tsx`](./src/App.tsx) |
| **6. 1-Click Vector Print Engine** | Instant 1-click vector PDF generation with jsPDF at 72 pt/in without browser dialog distortion. | [`src/engine/printOverlayEngine.ts`](./src/engine/printOverlayEngine.ts) |
| **7. Automated Test Suite** | 20-point regression test suite for JSONPath extraction, comb math, and spec validation. | [`src/test_engine.ts`](./src/test_engine.ts) |

---

## 🚀 Quick Start

### 1. Run Interactive Studio
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### 2. Run Automated Engine Test Suite
```bash
npx tsx src/test_engine.ts
```

### 3. Build for Production
```bash
npm run build
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`⌘K` / `Ctrl+K`** | Open Cal.com Command Palette |
| **`⌘P` / `Ctrl+P`** | 1-Click Direct Print PDF |
| **`⌘E` / `Ctrl+E`** | Export Annotation Spec JSON |
| **`Tab`** | Toggle Annotate vs Live Data Mode |

---

## 📬 Email Submission Details
Send to: `jaitee.wazalwar@instead.com`  
Subject: `Instead technical test submission - engineer - [Your Name]`
