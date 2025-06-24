import { TyneType } from '@/v1/utilities/index.js';

export class TyneTel extends TyneType<string> {
  readonly kind = 'tel';

  constructor() {
    super();
    this.checks.push((value, ctx) => {
      if (typeof value !== 'string') {
        ctx.addIssue({
          code: 'invalid_phone',
          message: `Invalid phone number format: expected string number`,
        });
      }

      if (typeof value === 'string') {
        // Permissive international phone number validation
        const telRegex = /^[+]?[\d\s().-]{7,}$/;
        if (!telRegex.test(value)) {
          ctx.addIssue({
            code: 'invalid_phone',
            message: `Invalid phone number`,
          });
        }

        // Check for minimum digit count
        const digitCount = value.replace(/\D/g, '').length;
        if (digitCount < 5) {
          ctx.addIssue({
            code: 'invalid_phone',
            message: `Phone number too short`,
          });
        }

        if (digitCount > 15) {
          ctx.addIssue({
            code: 'invalid_phone',
            message: `Phone number too long`,
          });
        }
      }
    });
  }

  toDts = () => 'string';
}

export const tel = () => new TyneTel();
