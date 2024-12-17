import Engine from '@stackpress/inquire/dist/Engine';
export type SearchParams = {
  q?: string,
  columns?: string[],
  include?: string[],
  filter?: Record<string, string|number|boolean>,
  span?: Record<string, (string|number|null|undefined)[]>,
  sort?: Record<string, any>,
  skip?: number,
  take?: number,
  total?: boolean
};

export type StorePlugin = Engine;