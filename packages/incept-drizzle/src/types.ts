export type DatabaseConfig = {
  database: {
    engine: string,
    url: string
  }
};
export type SearchParams = {
  q?: string,
  filter?: Record<string, string|number|boolean>,
  span?: Record<string, (string|number|null|undefined)[]>,
  sort?: Record<string, any>,
  skip?: number,
  take?: number
};