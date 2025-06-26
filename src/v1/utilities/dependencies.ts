/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable safeguard/no-raw-error */

type Dependency<T> = new (...args: any[]) => T;

const dependencies = new Map<string, Dependency<any>>();

export const registerDependency = <T extends Dependency<any>>(
  kind: string,
  dependency: T,
) => {
  dependencies.set(kind, dependency);
};

export const getDependency = <T extends Dependency<any>>(
  kind = 'default',
): T => {
  const dependency = dependencies.get(kind);
  if (!dependency) throw new Error(`Dependency ${kind} not registered`);
  return dependency as T;
};
