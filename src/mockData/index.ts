import form1040 from './form1040_2024_spec.json';
import formW2 from './formW2_2024_spec.json';
import sampleTaxpayer from './sample_taxpayer_return.json';
import { FormAnnotationSpec } from '../types/annotation';

export const PRESET_FORM_SPECS: Record<string, FormAnnotationSpec> = {
  'IRS-FORM-1040': form1040 as unknown as FormAnnotationSpec,
  'IRS-FORM-W2': formW2 as unknown as FormAnnotationSpec,
};

export const SAMPLE_TAXPAYER_DATA = sampleTaxpayer;
