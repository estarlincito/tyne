import { TyneType } from './tyne/index.js';

export class TyneEmail extends TyneType<string> {
  readonly kind = 'email';

  constructor() {
    super();
    this.checks.push((value, ctx) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value !== 'string' || !emailRegex.test(value)) {
        ctx.addIssue({
          code: 'invalid_email',
          message: 'Invalid email address',
        });
      }
    });
  }

  toDts = (): string => 'string';
}

export const email = () => new TyneEmail();
