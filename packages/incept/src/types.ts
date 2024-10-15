export type ResponsePayload<T = any> = {
  code?: number,
  status?: string, 
  errors?: Record<string, any>,
  results?: T,
  total?: number
};

export type SearchParams = {
  q?: string,
  filter?: Record<string, string|number|boolean>,
  span?: Record<string, (string|number|null|undefined)[]>,
  sort?: Record<string, any>,
  skip?: number,
  take?: number
};