/* eslint-disable safeguard/no-raw-error */
import { TyneType } from './tyne.js';

export class TyneUrl extends TyneType<string> {
  readonly kind = 'url';

  safeValidate(value: unknown): { success: boolean; error?: string } {
    if (typeof value !== 'string') {
      return { error: 'Expected string URL', success: false };
    }

    try {
      new URL(value);
      return { success: true };
    } catch {
      return { error: 'Invalid URL format', success: false };
    }
  }

  validate(value: unknown): string {
    const result = this.safeValidate(value);
    if (result.success) return value as string;
    throw new Error(result.error ?? 'Invalid URL');
  }

  toDts(name: string): string {
    return name ? `export type ${name} = string;` : 'string';
  }
}

export const url = () => new TyneUrl();
