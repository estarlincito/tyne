import { describe, expect, it } from 'vitest';

import { object } from './object.js';
import { string } from './string.js';

describe('TyneObject', () => {
  // toDts
  it('should generate a named TypeScript type for a non-empty object', () => {
    const result = object({ name: string() }).toDts('MyType');
    expect(result).toContain(`export type MyType = {
  name: string;
}`);
  });

  it('should generate "any" type for an empty object', () => {
    const result = object({}).toDts('MyType');
    expect(result).toContain(`export type MyType = any;`);
  });

  it('should generate an inline type when no name is provided', () => {
    const result = object({ name: string() }).toDts('');
    expect(result).toContain(`{
  name: string;
}`);
  });

  // validate
  it('should return the value if it matches the object schema', () => {
    const result = object({ name: string() }).validate({ name: 'Jhon' });
    expect(result).toStrictEqual({ name: 'Jhon' });
  });

  it('should throw an error if required keys do not match the schema', () => {
    expect(() => object({ name: string() }).validate({})).toThrowError(
      'name: Expected string',
    );
  });

  // safeValidate
  it('should return success=true when the object matches the schema', () => {
    const result = object({ name: string() }).safeValidate({ name: 'Apple' });
    expect(result).toEqual({ success: true });
  });

  it('should return an error when the input is not a valid object', () => {
    const result = object({ name: string() }).safeValidate(['']);
    expect(result).toEqual({
      error: 'name: Expected string',
      success: false,
    });
  });
});
