//stacpress
import type { UnknownNest, StatusResponse } from '@stackpress/types/dist/types';
import type Engine from '@stackpress/inquire/dist/Engine';
//incept
import type Model from '@stackpress/incept/dist/schema/Model';
//local
import search from './search';

/**
 * Returns a database table row
 */
export default async function get<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  key: string, 
  value: string|number
): Promise<StatusResponse<M|null>> {
  const filter: Record<string, string|number|boolean> = { [key]: value };
  if (model.active) {
    filter[model.active.name] = -1;
  }
  const response = await search<M>(model, engine, { filter, take: 1 });
  //@ts-ignore - Property 'results' does not exist on type 'ErrorResponse'.
  if (Array.isArray(response.results)) {
    //@ts-ignore - Property 'results' does not exist on type 'ErrorResponse'.
    response.results = response.results[0] || null;
  }
  return response as unknown as StatusResponse<M>;
};