import { describe, expect, it } from 'vitest';

import { string } from './string.js';

describe('TyneString', () => {
  // toDts
  it('should generate a named TypeScript string type when a name is provided', () => {
    const result = string().toDts('MyType');
    expect(result).toContain('export type MyType = string');
  });

  it('should generate the inline "string" type when no name is provided', () => {
    const result = string().toDts('');
    expect(result).toContain('string');
  });

  // validate
  it('should return the value if it is a string', () => {
    const result = string().validate('Hello');
    expect(result).toBe('Hello');
  });

  it('should throw an error if the value is not a string', () => {
    expect(() => string().validate(123)).toThrowError('Expected string');
  });

  // safeValidate
  it('should return success=true if the value is a string', () => {
    const result = string().safeValidate('Hola');
    expect(result).toEqual({ success: true });
  });

  it('should return an error if the value is not a string', () => {
    const result = string().safeValidate(42);
    expect(result).toEqual({ error: 'Expected string', success: false });
  });
});
