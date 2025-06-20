import { describe, expect, it } from 'vitest';

import { object } from './object.js';
import { string } from './string.js';
import { union } from './union.js';

describe('TyneUnion', () => {
  // toDts
  it('should generate a named TypeScript type when a name is provided', () => {
    const result = union(string(), object({ name: string() })).toDts('MyType');
    expect(result).toContain(`export type MyType = string | {
  name: string;
}`);
  });

  it('should generate an inline union type when no name is provided', () => {
    const result = union(string(), object({ name: string() })).toDts('');
    expect(result).toContain(`string | {
  name: string;
}`);
  });

  // validate
  it('should return the value if it matches any branch of the union', () => {
    const result = union(string(), object({ name: string() })).validate({
      name: 'Jhon',
    });
    expect(result).toStrictEqual({ name: 'Jhon' });
  });

  it('should throw an error if the value does not match any branch', () => {
    expect(() =>
      union(string(), object({ name: string() })).validate(0),
    ).toThrowError('No branch in union matched the value');
  });

  // safeValidate
  it('should return success=true if the value matches any branch', () => {
    const result = union(string(), object({ name: string() })).safeValidate({
      name: 'Apple',
    });
    expect(result).toEqual({ success: true });
  });

  it('should return success=false with an error if the value does not match any branch', () => {
    const result = union(string(), object({ name: string() })).safeValidate(0);
    expect(result).toEqual({
      error: 'No branch in union matched the value',
      success: false,
    });
  });
});
