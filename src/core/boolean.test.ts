import { describe, expect, it } from 'vitest';

import { boolean } from './boolean.js';

describe('TyneBoolean', () => {
  // toDts
  it('should generate a named TypeScript boolean type when a name is provided', () => {
    const result = boolean().toDts('MyType');
    expect(result).toContain('export type MyType = boolean');
  });

  it('should generate the inline "boolean" type when no name is provided', () => {
    const result = boolean().toDts('');
    expect(result).toContain('boolean');
  });

  // validate
  it('should return the value if it is a boolean', () => {
    const result = boolean().validate(true);
    expect(result).toBe(true);
  });

  it('should throw an error if the value is not a boolean', () => {
    expect(() => boolean().validate('')).toThrowError('Expected boolean');
  });

  // safeValidate
  it('should return success=true if the value is a boolean', () => {
    const result = boolean().safeValidate(true);
    expect(result).toEqual({ success: true });
  });

  it('should return an error if the value is not a boolean', () => {
    const result = boolean().safeValidate('');
    expect(result).toEqual({ error: 'Expected boolean', success: false });
  });
});
