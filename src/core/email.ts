/* eslint-disable safeguard/no-raw-error */
import { TyneType } from './tyne.js';

export class TyneEmail extends TyneType<string> {
  readonly kind = 'email';

  safeValidate(value: unknown): { success: boolean; error?: string } {
    if (typeof value !== 'string') {
      return { error: 'Expected string email', success: false };
    }

    // Basic but practical email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { error: 'Invalid email format', success: false };
    }

    return { success: true };
  }

  validate(value: unknown): string {
    const result = this.safeValidate(value);
    if (result.success) return value as string;
    throw new Error(result.error ?? 'Invalid email');
  }

  toDts(name: string): string {
    return name ? `export type ${name} = string;` : 'string';
  }
}

// Factory functions
export const email = () => new TyneEmail();
