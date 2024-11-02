import type { Scalar } from './types';
import I18N from './I18N';

export type * from './types';
export { I18N };

export const i18n = new I18N();
export const _ = (phrase: string, ...variables: Scalar[]) => {
  return i18n.translate(phrase, ...variables);
};