import install from './scripts/install';
import migrate from './scripts/migrate';
import purge from './scripts/purge';
import push from './scripts/push';

import {
  toResponse,
  toErrorResponse,
  toSqlString,
  toSqlBoolean,
  toSqlDate,
  toSqlFloat,
  toSqlInteger
} from './helpers';

export type * from './types';
export const scripts = {
  install,
  migrate,
  purge,
  push
};
export {
  toResponse,
  toErrorResponse,
  toSqlString,
  toSqlBoolean,
  toSqlDate,
  toSqlFloat,
  toSqlInteger
};