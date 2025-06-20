/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable safeguard/no-raw-error */
import { TyneType } from './tyne.js';

export class TyneLiteral<
  T extends string | number | boolean | null,
> extends TyneType<T> {
  readonly kind = 'literal';

  constructor(private readonly literalValue: T) {
    super();
  }

  safeValidate(value: unknown): { success: boolean; error?: string } {
    // Handle special cases for NaN and -0
    if (
      typeof this.literalValue === 'number' &&
      Number.isNaN(this.literalValue)
    ) {
      if (typeof value === 'number' && Number.isNaN(value)) {
        return { success: true };
      }
      return { error: `Expected NaN`, success: false };
    }

    if (
      typeof this.literalValue === 'number' &&
      Object.is(this.literalValue, -0)
    ) {
      if (Object.is(value, -0)) {
        return { success: true };
      }
      return { error: `Expected -0`, success: false };
    }

    // Handle normal equality comparison
    if (value !== this.literalValue) {
      return {
        error: `Expected literal ${this.formatLiteralForError(
          this.literalValue,
        )}, got ${this.formatLiteralForError(value)}`,
        success: false,
      };
    }

    return { success: true };
  }

  validate(value: unknown): T {
    const result = this.safeValidate(value);
    if (result.success) return value as T;
    throw new Error(
      result.error ??
        `Expected ${this.formatLiteralForError(this.literalValue)}`,
    );
  }

  toDts(name: string): string {
    const literalType = this.formatLiteralForType(this.literalValue);

    return name ? `export type ${name} = ${literalType};` : literalType;
  }

  private formatLiteralForError(value: unknown): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'number' && Number.isNaN(value)) return 'NaN';
    if (typeof value === 'number' && Object.is(value, -0)) return '-0';
    return String(value);
  }

  private formatLiteralForType(value: unknown): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${this.escapeString(value)}"`;
    if (typeof value === 'number' && Number.isNaN(value)) return 'number'; // NaN has no literal representation
    if (typeof value === 'number' && Object.is(value, -0)) return '0'; // TypeScript doesn't distinguish -0
    return String(value);
  }

  private escapeString(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }
}

export const literal = <T extends string | number | boolean | null>(value: T) =>
  new TyneLiteral(value);
