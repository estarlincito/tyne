/* eslint-disable safeguard/no-raw-error */
import { TyneType } from './tyne.js';

export class TyneUndefined extends TyneType<undefined> {
  readonly kind = 'undefined';

  safeValidate(value: unknown): { success: boolean; error?: string } {
    if (value === undefined) {
      return { success: true };
    }
    return {
      error: `Expected undefined, got ${typeof value}`,
      success: false,
    };
  }

  validate(value: unknown): undefined {
    if (value === undefined) return value;
    throw new Error(`Expected undefined, got ${typeof value}`);
  }

  toDts(name: string): string {
    return name ? `export type ${name} = undefined;` : 'undefined';
  }
}

export const undef = () => new TyneUndefined();
