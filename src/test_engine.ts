import { resolveDataPath, applyTransform } from './engine/jsonPathResolver';
import { calculateCombCells } from './engine/combFormatter';
import { validateFormSpec } from './engine/validator';
import { PRESET_FORM_SPECS, SAMPLE_TAXPAYER_DATA } from './mockData';

function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING INSTEAD TAX ANNOTATION ENGINE TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. JSONPath Nested Extraction Tests
  console.log('--- 1. Nested JSONPath Extraction ---');
  const d = SAMPLE_TAXPAYER_DATA;
  assert(resolveDataPath(d, '$.taxpayer.personalInfo.firstName') === 'Alex', 'Extract $.taxpayer.personalInfo.firstName');
  assert(resolveDataPath(d, 'taxpayer.address.city') === 'San Francisco', 'Extract taxpayer.address.city');
  assert(resolveDataPath(d, '$.income.w2Forms[0].box1Wages') === 185450.0, 'Extract $.income.w2Forms[0].box1Wages');
  assert(resolveDataPath(d, '$.taxpayer.dependents[1].ssn') === '789123456', 'Extract $.taxpayer.dependents[1].ssn');
  assert(resolveDataPath(d, '$.nonExistent.path') === undefined, 'Missing path returns undefined');

  // 2. Transformation Pipeline Tests
  console.log('\n--- 2. Transformation Pipeline ---');
  assert(applyTransform('san francisco', 'UPPERCASE') === 'SAN FRANCISCO', 'UPPERCASE transform');
  assert(applyTransform('123456789', 'SSN_HYPHENATED') === '123-45-6789', 'SSN_HYPHENATED transform');
  assert(applyTransform('123-45-6789', 'SSN_UNMASKED_DIGITS') === '123456789', 'SSN_UNMASKED_DIGITS transform');
  assert(applyTransform('123456789', 'SSN_MASKED_FIRST_FIVE') === '***-**-6789', 'SSN_MASKED_FIRST_FIVE transform');
  assert(applyTransform('941234567', 'EIN_HYPHENATED') === '94-1234567', 'EIN_HYPHENATED transform');
  assert(applyTransform(185450.4, 'CURRENCY_NO_CENTS') === '185,450', 'CURRENCY_NO_CENTS whole dollar');
  assert(applyTransform(-2500, 'CURRENCY_NO_CENTS') === '(2,500)', 'Negative currency parentheses');
  assert(applyTransform(true, 'BOOLEAN_TO_X') === 'X', 'BOOLEAN_TO_X true');
  assert(applyTransform(false, 'BOOLEAN_TO_X') === '', 'BOOLEAN_TO_X false');

  // 3. Comb Box Segmentation Calculation Tests
  console.log('\n--- 3. Comb Box Layout Arithmetic ---');
  const combBounds = { x: 476, y: 100, width: 102, height: 16 };
  const combConfig = {
    cellCount: 9,
    cellWidth: 9.5,
    cellGap: 1.2,
    groups: [3, 2, 4],
    groupGaps: [6.0, 6.0],
    delimiter: '-',
  };
  const cells = calculateCombCells('123456789', combBounds, combConfig);
  assert(cells.length === 11, 'Calculated 11 total cells (9 digits + 2 delimiters)');
  assert(cells[0].char === '1' && cells[0].x === 476, 'First SSN digit positioned at X=476');
  assert(cells[3].isDelimiter === true && cells[3].char === '-', 'First group delimiter hyphen positioned');
  assert(cells[10].char === '9', 'Last SSN digit is 9');

  // 4. Form Annotation Spec Validations
  console.log('\n--- 4. Form Annotation Spec Validation ---');
  for (const [formId, spec] of Object.entries(PRESET_FORM_SPECS)) {
    const issues = validateFormSpec(spec);
    const errors = issues.filter((i) => i.type === 'error');
    assert(errors.length === 0, `Spec ${formId} passed validation with 0 errors (${spec.fields.length} fields)`);
  }

  console.log('\n====================================================');
  console.log(`🎉 TEST RUN COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');
}

runTests();
