/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys-fix/sort-keys-fix */

import {
  type CheckFn,
  TyneContext,
  type TyneIssue,
} from '@/v1/utilities/context.js';
import { TyneError } from '@/v1/utilities/error.js';

import type { TyneDefault } from './default.js';
import { getDependency } from './dependencies.js';
import type { TyneNullable } from './nullable.js';
import type { TyneOptional } from './optional.js';
import type { RefineFn, RefineOpts, TyneRefined } from './refined.js';
import type { TransformFn, TyneTransformed } from './transformed.js';

interface SafeValidate<T> {
  success: boolean;
  error?: TyneIssue[];
  data?: T;
}

export abstract class TyneType<T = any> {
  checks: CheckFn<T>[] = [];
  abstract readonly kind: string;
  declare readonly _type: T;

  validate(data: unknown): T {
    const result = this.safeValidate(data);
    if (!result.success) {
      throw new TyneError(result.error!);
    }
    return result.data as T;
  }

  safeValidate(data: unknown): SafeValidate<T> {
    const issues: TyneIssue[] = [];
    const ctx = new TyneContext(issues);

    for (const check of this.checks) {
      check(data, ctx);
    }

    if (issues.length === 0) {
      return { success: true, data: data as T };
    }
    return { success: false, error: issues };
  }

  toDts = (): string => 'any';

  optional = (): TyneOptional<T> => {
    const Optional = getDependency<typeof TyneOptional>('optional');

    return new Optional(this);
  };

  nullable = (): TyneNullable<T> => {
    const Nullable = getDependency<typeof TyneNullable>('nullable');

    return new Nullable(this);
  };

  default = <D extends T>(def: D): TyneDefault<T, D> => {
    const Default = getDependency('default');

    return new Default(this, def);
  };

  refine = (refiner: RefineFn<T>, options: RefineOpts): TyneRefined<T> => {
    const Refined = getDependency<typeof TyneRefined>('refined');

    return new Refined(this, refiner, options);
  };

  transform = <U>(transformer: TransformFn<T, U>): TyneTransformed<T, U> => {
    const Transformed = getDependency<typeof TyneTransformed>('transform');

    return new Transformed(this, transformer);
  };
}
