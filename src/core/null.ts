/* eslint-disable safeguard/no-raw-error */
import { TyneType } from './tyne.js';

export class TyneNull extends TyneType<null> {
  readonly kind = 'null';

  safeValidate(value: unknown): { success: boolean; error?: string } {
    if (value === null) {
      return { success: true };
    }
    return {
      error: `Expected null, got ${
        value === undefined ? 'undefined' : typeof value
      }`,
      success: false,
    };
  }

  validate(value: unknown): null {
    if (value === null) return value;
    throw new Error(
      `Expected null, got ${value === undefined ? 'undefined' : typeof value}`,
    );
  }

  toDts(name: string): string {
    return name ? `export type ${name} = null;` : 'null';
  }
}

export const nullType = () => new TyneNull();
