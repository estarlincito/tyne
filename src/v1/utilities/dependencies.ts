/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable safeguard/no-raw-error */
import type { TyneType } from './base.js';

type Dependency = new (...args: any[]) => TyneType<any>;

const dependencies = new Map<string, Dependency>();

export const registerDependency = <T extends Dependency>(
  kind: string,
  dependency: T,
) => {
  dependencies.set(kind, dependency);
};

export const getDependency = <T extends Dependency>(kind = 'default'): T => {
  const dependency = dependencies.get(kind);
  if (!dependency) throw new Error(`Dependency ${kind} not registered`);
  return dependency as T;
};
