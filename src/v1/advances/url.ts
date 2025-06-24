import { TyneType } from '@/v1/utilities/index.js';

export class TyneUrl extends TyneType<string> {
  readonly kind = 'url';

  constructor() {
    super();
    this.checks.push((value, ctx) => {
      if (typeof value !== 'string') {
        ctx.addIssue({
          code: 'invalid_url',
          message: 'Expected string URL',
        });
      } else {
        try {
          new URL(value);
          return;
        } catch {
          ctx.addIssue({
            code: 'invalid_url',
            message: 'Invalid URL format',
          });
        }
      }
    });
  }

  toDts = (): string => 'URL';
}

export const url = () => new TyneUrl();
