/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TyneType } from '@/v1/utilities/index.js';

export class TyneArray<T extends TyneType> extends TyneType<T['_type'][]> {
  readonly kind = 'array';

  constructor(public readonly element: T) {
    super();

    this.checks.push((value, ctx) => {
      if (!Array.isArray(value)) {
        ctx.addIssue({
          code: 'invalid_type',
          message: 'Expected array',
        });
      } else {
        for (let i = 0; i < value.length; i += 1) {
          const safe = this.element.safeValidate(value[i]);

          if (!safe.success) {
            ctx.addIssue({
              code: 'invalid_type',
              message: `[${i}]: ${safe.error![0]?.message ?? 'Invalid'}`,
            });
          }
        }

        if (value.length < 1) {
          ctx.addIssue({
            code: 'too_small',
            message: 'Too small: expected array to have at least 1 item',
          });
        }
      }
    });
  }

  toDts = () => `${this.element.toDts()}[]`;
}

export const array = <T extends TyneType>(element: T) => new TyneArray(element);
