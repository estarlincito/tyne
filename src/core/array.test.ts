import { describe, expect, it } from 'vitest';

import { array } from './array.js';
import { string } from './string.js';

describe('TyneArray', () => {
  // toDts
  it('should generate a named TypeScript type when a name is provided', () => {
    const result = array(string()).toDts('MyType');
    expect(result).toContain(`export type MyType = string[]`);
  });

  it('should generate an inline type when no name is provided', () => {
    const result = array(string()).toDts('');
    expect(result).toContain(`string[]`);
  });

  // validate
  it('should return the original value if it matches the schema', () => {
    const result = array(string()).validate(['Jhon']);
    expect(result).toStrictEqual(['Jhon']);
  });

  it('should throw an error if the value is not an array', () => {
    expect(() => array(string()).validate(0)).toThrowError('Expected array');
  });

  // safeValidate
  it('should return success=true when value matches the schema', () => {
    const result = array(string()).safeValidate(['Apple']);
    expect(result).toEqual({ success: true });
  });

  it('should return success=false and an error when value is not an array', () => {
    const result = array(string()).safeValidate(0);
    expect(result).toEqual({
      error: 'Expected array',
      success: false,
    });
  });
});
