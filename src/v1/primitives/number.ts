import { TyneType } from '@/v1/utilities/index.js';

export class TyneNumber extends TyneType<number> {
  readonly kind = 'number';

  constructor() {
    super();
    this.checks.push((value, ctx) => {
      if (typeof value !== this.kind) {
        ctx.addIssue({
          code: 'invalid_type',
          message: `Expected ${this.kind}`,
        });
      }
    });
  }

  min(length: number, message = `Must be at least ${length} characters`) {
    this.checks.push((value, ctx) => {
      if (typeof value === 'string' && value.length < length) {
        ctx.addIssue({ code: 'too_small', message });
      }
    });
    return this;
  }

  max(length: number, message = `Must be at most ${length} characters`) {
    this.checks.push((value, ctx) => {
      if (typeof value === 'string' && value.length > length) {
        ctx.addIssue({ code: 'too_big', message });
      }
    });
    return this;
  }

  toDts = () => this.kind;
}

export const number = () => new TyneNumber();
