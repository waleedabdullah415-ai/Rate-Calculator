import { RowData } from '../types';

export const generateId = (): string => {
  // Use crypto.randomUUID if available (Secure Contexts like HTTPS or localhost)
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  
  // Fallback for non-secure contexts (HTTP) or older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const calculateCommissionFromRates = (basic: number | '', discount: number | '', r1: number, r2: number): number => {
    const b = Number(basic) || 0;
    const d = Number(discount) || 0;
    
    // basicrate - discount
    const net = Math.max(0, b - d);
    
    // answer * 1.5% (or r1%)
    const step1 = net * (r1 / 100);
    
    // answer - 12% (or r2%) -> This implies reducing the previous result by 12%
    // Formula logic: step1 - (step1 * 12%) = step1 * (1 - 0.12)
    const final = step1 * (1 - (r2 / 100));
    
    return Number(final.toFixed(2));
};

// Formula: basic-rate - Discount * Tax% - commission + freight = result
// Interpretation: (BasicRate - Discount) * (Tax / 100)) - Commission + Freight
export const calculateRowResult = (row: RowData): number => {
  const basicRate = Number(row.basicRate) || 0;
  const discount = Number(row.discount) || 0;
  const taxPercent = Number(row.taxPercent) || 0;
  const commission = Number(row.commission) || 0;
  const freight = Number(row.freight) || 0;

  // Calculate the tax deduction part based on specific order of operations

  const first = basicRate - discount;
  const taxDeduction = first * (taxPercent / 100);
  const answer  = first + taxDeduction

  const result = (answer - commission) + freight;

  return Number(result.toFixed(2));
};

export const evaluateFormula = (formula: string): number | null => {
  if (!formula || !formula.trim()) return null;

  try {
    // 1. Replace percentage: 12.5% -> (12.5/100)
    // We handle integers and decimals, optional space before %
    let parsed = formula.replace(/(\d+(\.\d+)?)[\s]*%/g, '($1/100)');
    
    // 2. Security Check: Allow only numbers, math operators, and spaces
    if (/[^0-9+\-*/().\s]/.test(parsed)) {
      return null;
    }

    // 3. Evaluate safely
    // eslint-disable-next-line no-new-func
    const result = new Function('return ' + parsed)();
    
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return Number(result.toFixed(4)); 
    }
    return null;
  } catch (e) {
    // Suppress errors for incomplete expressions during typing
    return null;
  }
};