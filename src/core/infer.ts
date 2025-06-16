/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TyneType } from './tyne.js';
export type infer<T extends TyneType<any>> = T['_type'];
