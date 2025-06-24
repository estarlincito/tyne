import { TyneType } from './tyne/index.js';

export class TyneString extends TyneType<string> {
  readonly kind = 'string';
  constructor() {
    super();
    this.checks.push((value, ctx) => {
      if (typeof value !== this.kind) {
        ctx.addIssue({
          code: 'invalid_type',
          message: 'Expected string',
        });
      }
    });
  }

  min(length: number, message = `Must be at least ${length} chars`) {
    this.checks.push((value, ctx) => {
      if (typeof value === 'string' && value.length < length) {
        ctx.addIssue({ code: 'too_short', message });
      }
    });
    return this;
  }

  max(length: number, message = `Must be at most ${length} chars`) {
    this.checks.push((value, ctx) => {
      if (typeof value === 'string' && value.length > length) {
        ctx.addIssue({ code: 'too_long', message });
      }
    });
    return this;
  }

  nonempty(
    message = `Too small: expected ${this.kind} to have >=1 characters`,
  ) {
    this.checks.push((value, ctx) => {
      if (typeof value === 'string' && value.length < 1) {
        ctx.addIssue({ code: 'too_small', message });
      }
    });
    return this;
  }

  toDts = () => this.kind;
}

export const string = () => new TyneString();
