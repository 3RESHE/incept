//local
import type { Scalar } from './types';
import I18N from './I18N';
import plugin from './plugin';

export type * from './types';
export { I18N, plugin };

export const i18n = new I18N();
export const _ = (phrase: string, ...variables: Scalar[]) => {
  return i18n.translate(phrase, ...variables);
};