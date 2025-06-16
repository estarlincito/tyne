import { describe, expect, it } from 'vitest';

import { number } from './number.js';

describe('TyneNumber', () => {
  // toDts
  it('should generate a named TypeScript number type when a name is provided', () => {
    const result = number().toDts('MyType');
    expect(result).toContain('export type MyType = number');
  });

  it('should generate the inline "number" type when no name is provided', () => {
    const result = number().toDts('');
    expect(result).toContain('number');
  });

  // validate
  it('should return the value if it is a number', () => {
    const result = number().validate(0);
    expect(result).toBe(0);
  });

  it('should throw an error if the value is not a number', () => {
    expect(() => number().validate('')).toThrowError('Expected number');
  });

  // safeValidate
  it('should return success=true if the value is a number', () => {
    const result = number().safeValidate(0);
    expect(result).toEqual({ success: true });
  });

  it('should return an error if the value is not a number', () => {
    const result = number().safeValidate('');
    expect(result).toEqual({ error: 'Expected number', success: false });
  });
});
