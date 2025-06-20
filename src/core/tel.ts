/* eslint-disable safeguard/no-raw-error */
import { TyneType } from './tyne.js';

export class TyneTel extends TyneType<string> {
  readonly kind = 'tel';

  safeValidate(value: unknown): { success: boolean; error?: string } {
    if (typeof value !== 'string') {
      return { error: 'Expected string phone number', success: false };
    }

    // Permissive international phone number validation
    const phoneRegex = /^[+]?[0-9\s\-()]{5,25}$/;
    if (!phoneRegex.test(value)) {
      return { error: 'Invalid phone number format', success: false };
    }

    // Check for minimum digit count
    const digitCount = value.replace(/\D/g, '').length;
    if (digitCount < 5) {
      return { error: 'Phone number too short', success: false };
    }

    if (digitCount > 15) {
      return { error: 'Phone number too long', success: false };
    }

    return { success: true };
  }

  validate(value: unknown): string {
    const result = this.safeValidate(value);
    if (result.success) return value as string;
    throw new Error(result.error ?? 'Invalid phone number');
  }

  toDts(name: string): string {
    return name ? `export type ${name} = string;` : 'string';
  }
}

export const tel = () => new TyneTel();
